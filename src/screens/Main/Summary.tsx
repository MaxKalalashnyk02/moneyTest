import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  Divider,
  Icon,
  Overlay,
  Input,
  FAB,
} from '@rneui/themed';
import {PieChart} from 'react-native-chart-kit';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useFocusEffect} from '@react-navigation/native';

import {useTheme} from '../../contexts/ThemeContext';
import {useAuth} from '../../contexts/AuthContext';

import {useExpenses} from '../../hooks/useExpenses';
import {useAccounts} from '../../hooks/useAccounts';

import {Expense} from '../../services/expenseService';

import {darkTheme, lightTheme} from '../../theme/colors';
import {styles} from './styles/SummaryStyles';

const PERIODS = ['Day', 'Week', 'Month', 'Year'];
const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Shopping'];
const CATEGORY_COLORS = {
  Food: '#FF6384',
  Transport: '#36A2EB',
  Bills: '#FFCE56',
  Entertainment: '#4BC0C0',
  Shopping: '#9966FF',
  Other: '#FF9F40',
};

type ExpenseSummary = {
  period: string;
  totalAmount: number;
  categories: CategorySummary[];
};

type CategorySummary = {
  name: string;
  amount: number;
  color: string;
  percentage: number;
};

const Summary = () => {
  const {expenses, isLoading, loadExpenses, addExpense} = useExpenses();
  const {accounts, loadAccounts, updateAccount} = useAccounts();
  const {toggleTheme, isDark} = useTheme();
  const {user} = useAuth();

  const colors = isDark ? darkTheme : lightTheme;
  const stylesWithColors = styles(colors);

  const [selectedPeriod, setSelectedPeriod] = useState('Month');
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);

  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [titleError, setTitleError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [accountError, setAccountError] = useState('');
  const [categoryError, setCategoryError] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadExpenses();
      loadAccounts();
    }, [loadExpenses, loadAccounts]),
  );

  useEffect(() => {
    if (accounts.length > 0 && !selectedAccount) {
      const mainAccount = accounts.find(acc => acc.name === 'Main Account');
      if (mainAccount) {
        setSelectedAccount(mainAccount.id);
      } else if (accounts.length > 0) {
        setSelectedAccount(accounts[0].id);
      }
    }
  }, [accounts, selectedAccount]);

  const filterExpensesByPeriod = useCallback(
    (expenseList: Expense[], period: string): Expense[] => {
      const now = new Date();
      let startDate = new Date();

      switch (period) {
        case 'Day':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'Week':
          const day = now.getDay();
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - day,
          );
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'Month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'Year':
          startDate = new Date(now.getFullYear(), 0, 1);
          startDate.setHours(0, 0, 0, 0);
          break;
        default:
          startDate.setMonth(now.getMonth() - 1);
      }

      return expenseList.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startDate && expenseDate <= now;
      });
    },
    [],
  );

  const calculateSummary = useCallback(
    (expenseList: Expense[]): ExpenseSummary | null => {
      if (expenseList.length === 0) {
        return null;
      }

      const categories: Record<string, CategorySummary> = {};
      let totalAmount = 0;

      expenseList.forEach(expense => {
        const cat = expense.category || 'Other';
        if (!categories[cat]) {
          categories[cat] = {
            name: cat,
            amount: 0,
            color:
              CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS] ||
              CATEGORY_COLORS.Other,
            percentage: 0,
          };
        }

        categories[cat].amount += expense.amount;
        totalAmount += expense.amount;
      });

      Object.values(categories).forEach(category => {
        category.percentage = Math.round((category.amount / totalAmount) * 100);
      });

      return {
        period: selectedPeriod,
        totalAmount,
        categories: Object.values(categories),
      };
    },
    [selectedPeriod],
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const toggleOverlay = () => {
    if (visible) {
      resetForm();
    } else {
      if (accounts.length > 0 && !selectedAccount) {
        const mainAccount = accounts.find(acc => acc.name === 'Main Account');
        if (mainAccount) {
          setSelectedAccount(mainAccount.id);
        } else {
          setSelectedAccount(accounts[0].id);
        }
      }
    }
    setVisible(!visible);
  };

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setCategory('');
    setDate(new Date());

    setIsSubmitting(false);
    setTitleError('');
    setAmountError('');
    setAccountError('');
    setCategoryError('');
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  useEffect(() => {
    if (expenses.length === 0 && !isLoading) {
      setSummary(null);
      return;
    }

    const filteredExpenses = filterExpensesByPeriod(expenses, selectedPeriod);
    const calculatedSummary = calculateSummary(filteredExpenses);
    setSummary(calculatedSummary);
  }, [
    expenses,
    selectedPeriod,
    isLoading,
    filterExpensesByPeriod,
    calculateSummary,
  ]);

  const chartData =
    summary?.categories.map(category => ({
      name: category.name,
      population: category.amount,
      color: category.color,
      legendFontColor: colors.text,
      legendFontSize: 12,
    })) || [];

  const validateInputs = () => {
    let isValid = true;

    if (!title.trim()) {
      setTitleError('Title is required');
      isValid = false;
    } else {
      setTitleError('');
    }

    if (!amount.trim()) {
      setAmountError('Amount is required');
      isValid = false;
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setAmountError('Please enter a valid positive number');
      isValid = false;
    } else {
      setAmountError('');
    }

    if (!category.trim()) {
      setCategoryError('Category is required');
      isValid = false;
    } else {
      setCategoryError('');
    }

    if (!selectedAccount) {
      setAccountError('Please select an account');
      isValid = false;
    } else {
      setAccountError('');
    }

    return isValid;
  };

  const handleAddExpense = async () => {
    if (isSubmitting) {
      return;
    }
    if (!user) {
      Alert.alert('Error', 'Please log in to add expenses');
      return;
    }

    if (!validateInputs()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const expenseAmount = parseFloat(amount);

      const newExpense = {
        title,
        amount: expenseAmount,
        category,
        date,
        account_id: selectedAccount,
        user_id: user.id,
      };

      if (summary) {
        const updatedSummary = {...summary};
        const cat = category || 'Other';

        let catSummary = updatedSummary.categories.find(c => c.name === cat);
        if (!catSummary) {
          catSummary = {
            name: cat,
            amount: 0,
            color:
              CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS] ||
              CATEGORY_COLORS.Other,
            percentage: 0,
          };
          updatedSummary.categories.push(catSummary);
        }

        catSummary.amount += expenseAmount;
        updatedSummary.totalAmount += expenseAmount;

        updatedSummary.categories.forEach(c => {
          c.percentage = Math.round(
            (c.amount / updatedSummary.totalAmount) * 100,
          );
        });

        setSummary(updatedSummary);
      }

      toggleOverlay();

      await addExpense(newExpense);

      const account = accounts.find(acc => acc.id === selectedAccount);
      if (account) {
        await updateAccount(selectedAccount, {
          balance: account.balance - expenseAmount,
        });
        await loadAccounts();
      }

      await loadExpenses();
    } catch (e) {
      console.error('Error saving expense:', e);
      Alert.alert('Error', 'Failed to save expense. Please try again.');
      setIsSubmitting(false);
    }
  };

  const renderPeriodSelector = () => (
    <View style={stylesWithColors.periodsContainer}>
      {PERIODS.map(period => (
        <TouchableOpacity
          key={period}
          style={[
            stylesWithColors.periodButton,
            selectedPeriod === period && stylesWithColors.selectedPeriod,
          ]}
          onPress={() => setSelectedPeriod(period)}>
          <Text
            style={[
              stylesWithColors.periodText,
              selectedPeriod === period && stylesWithColors.selectedPeriodText,
            ]}>
            {period}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSummaryChart = () => (
    <Card containerStyle={stylesWithColors.summaryCard}>
      <Text style={stylesWithColors.totalAmount}>
        ${summary!.totalAmount.toFixed(2)}
      </Text>
      <Text style={stylesWithColors.summaryDescription}>
        Total spending for {selectedPeriod.toLowerCase()}
      </Text>

      <View style={stylesWithColors.chartContainer}>
        <PieChart
          data={chartData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={{
            backgroundColor: colors.card,
            backgroundGradientFrom: colors.card,
            backgroundGradientTo: colors.card,
            color: (opacity = 1) =>
              `rgba(${isDark ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      <Divider style={stylesWithColors.divider} />

      <View style={stylesWithColors.legendContainer}>
        {summary!.categories.map(category => (
          <View key={category.name} style={stylesWithColors.legendItem}>
            <View
              style={[
                stylesWithColors.colorIndicator,
                {backgroundColor: category.color},
              ]}
            />
            <Text style={stylesWithColors.categoryName}>{category.name}</Text>
            <Text style={stylesWithColors.categoryAmount}>
              ${category.amount.toFixed(2)}
            </Text>
            <Text style={stylesWithColors.categoryPercentage}>
              {category.percentage}%
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );

  const renderNoDataView = () => (
    <View style={stylesWithColors.noDataContainer}>
      <Text style={stylesWithColors.noDataText}>
        No expense data available for the selected period.
      </Text>
      <Button
        title="Add Expense"
        buttonStyle={stylesWithColors.addButton}
        titleStyle={stylesWithColors.buttonTitle}
        onPress={toggleOverlay}
      />
    </View>
  );

  const renderAddExpenseForm = () => (
    <Overlay
      isVisible={visible}
      onBackdropPress={toggleOverlay}
      overlayStyle={stylesWithColors.overlay}>
      <Text h4 style={stylesWithColors.overlayTitle}>
        Add New Expense
      </Text>

      <Input
        placeholder="Title"
        value={title}
        onChangeText={text => {
          setTitle(text);
          if (text.trim()) {
            setTitleError('');
          }
        }}
        inputStyle={stylesWithColors.inputText}
        labelStyle={stylesWithColors.inputLabel}
        label="Title"
        errorMessage={titleError}
        errorStyle={{color: 'red', fontSize: 12}}
      />

      <Input
        placeholder="Amount"
        value={amount}
        onChangeText={text => {
          setAmount(text);
          if (text.trim() && !isNaN(parseFloat(text)) && parseFloat(text) > 0) {
            setAmountError('');
          }
        }}
        keyboardType="numeric"
        inputStyle={stylesWithColors.inputText}
        labelStyle={stylesWithColors.inputLabel}
        label={
          selectedAccount
            ? `Amount (in ${
                accounts.find(acc => acc.id === selectedAccount)?.currency ||
                'USD'
              })`
            : 'Amount'
        }
        errorMessage={amountError}
        errorStyle={{color: 'red', fontSize: 12}}
      />

      <Input
        placeholder="Category"
        value={category}
        onChangeText={text => {
          setCategory(text);
          if (text.trim()) {
            setCategoryError('');
          }
        }}
        inputStyle={stylesWithColors.inputText}
        labelStyle={stylesWithColors.inputLabel}
        label="Category"
        errorMessage={categoryError}
        errorStyle={{color: 'red', fontSize: 12}}
      />

      <Text style={stylesWithColors.sectionLabel}>Select Category</Text>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={stylesWithColors.scrollContainer}
        contentContainerStyle={stylesWithColors.scrollContent}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              stylesWithColors.categoryButton,
              category === cat && stylesWithColors.activeCategoryButton,
            ]}
            onPress={() => {
              setCategory(cat);
              setCategoryError('');
            }}>
            <Text
              style={[
                stylesWithColors.categoryText,
                category === cat && stylesWithColors.activeCategoryText,
              ]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={stylesWithColors.datePickerContainer}>
        <Text style={stylesWithColors.inputLabel}>Date</Text>
        <TouchableOpacity
          style={stylesWithColors.datePickerButton}
          onPress={toggleDatePicker}>
          <Text style={stylesWithColors.datePickerText}>
            {formatDate(date)}
          </Text>
          <Icon name="calendar" type="feather" size={18} color={colors.text} />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
            maximumDate={new Date()}
            style={Platform.OS === 'ios' ? {height: 120} : undefined}
          />
        )}
      </View>

      <Text style={stylesWithColors.inputLabel}>Account</Text>
      {accounts.length === 0 ? (
        <Text style={stylesWithColors.noAccountsText}>
          No accounts available. Please add an account first.
        </Text>
      ) : (
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={stylesWithColors.accountsScrollView}
          contentContainerStyle={stylesWithColors.accountsScrollViewContent}>
          {accounts.map(account => (
            <TouchableOpacity
              key={account.id}
              style={[
                stylesWithColors.accountButton,
                selectedAccount === account.id &&
                  stylesWithColors.selectedAccountButton,
                {borderLeftColor: account.color},
              ]}
              onPress={() => {
                setSelectedAccount(account.id);
                setAccountError('');
              }}>
              <Text
                style={[
                  stylesWithColors.accountButtonText,
                  selectedAccount === account.id &&
                    stylesWithColors.selectedAccountButtonText,
                ]}>
                {account.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {accountError ? (
        <Text
          style={{
            color: 'red',
            fontSize: 12,
            marginBottom: 10,
            marginLeft: 10,
          }}>
          {accountError}
        </Text>
      ) : null}

      <Button
        title="Add Expense"
        buttonStyle={stylesWithColors.addButton}
        titleStyle={stylesWithColors.addButtonText}
        onPress={handleAddExpense}
        disabled={isSubmitting}
      />
    </Overlay>
  );

  return (
    <SafeAreaView style={stylesWithColors.container}>
      <View style={stylesWithColors.header}>
        <Text h4 style={stylesWithColors.headerTitle}>
          Expense Summary
        </Text>
        <View style={stylesWithColors.themeToggle}>
          <Icon name="sun" type="feather" size={16} color={colors.headerText} />
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isDark ? '#ffffff' : '#f4f3f4'}
          />
          <Icon
            name="moon"
            type="feather"
            size={16}
            color={colors.headerText}
          />
        </View>
      </View>

      <ScrollView>
        {renderPeriodSelector()}
        {summary ? renderSummaryChart() : renderNoDataView()}
      </ScrollView>

      <FAB
        placement="right"
        icon={{name: 'add', color: '#000000'}}
        color={colors.accent}
        style={stylesWithColors.fab}
        onPress={toggleOverlay}
      />

      {renderAddExpenseForm()}
    </SafeAreaView>
  );
};

export default Summary;
