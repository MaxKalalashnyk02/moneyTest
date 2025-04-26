import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Pressable,
  Switch,
  ActivityIndicator,
  Platform,
  ScrollView,
} from 'react-native';
import {
  Text,
  Button,
  FAB,
  Card,
  Input,
  Overlay,
  Icon,
  Divider,
} from '@rneui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useFocusEffect} from '@react-navigation/native';

import {useTheme} from '../../contexts/ThemeContext';
import {useAuth} from '../../contexts/AuthContext';

import {useExpenses} from '../../hooks/useExpenses';
import {useAccounts} from '../../hooks/useAccounts';

import {darkTheme, lightTheme} from '../../theme/colors';
import {styles} from './styles/ExpenseStyles';

const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Shopping'];

const Expense = () => {
  const {toggleTheme, isDark} = useTheme();
  const {user} = useAuth();
  const {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    filterExpenses,
    isLoading,
    loadExpenses,
    currentSortOrder,
    changeSortOrder,
  } = useExpenses();
  const {accounts, loadAccounts, updateAccount} = useAccounts();

  const colors = isDark ? darkTheme : lightTheme;
  const dynamicStyles = styles(colors);

  const [visible, setVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [titleError, setTitleError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [accountError, setAccountError] = useState('');
  const [categoryError, setCategoryError] = useState('');

  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<string>('desc');

  const [deletingExpenseIds, setDeletingExpenseIds] = useState<string[]>([]);
  const [initialRenderDone, setInitialRenderDone] = useState(false);
  const manuallyOpened = useRef(false);
  const filterManuallyOpened = useRef(false);

  const [_isDatePickerVisible, _setIsDatePickerVisible] = useState(false);
  const [_isAccountPickerVisible, _setIsAccountPickerVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!manuallyOpened.current) {
        setVisible(false);
      }

      if (!filterManuallyOpened.current) {
        setIsFilterVisible(false);
      }

      loadAccounts();
      loadExpenses();

      if (filterStartDate || filterEndDate || filterCategories.length > 0) {
        filterExpenses(
          filterStartDate,
          filterEndDate,
          filterCategories,
          sortOrder,
        );
      }

      return () => {};
    }, [
      loadAccounts,
      loadExpenses,
      filterExpenses,
      filterStartDate,
      filterEndDate,
      filterCategories,
      sortOrder,
    ]),
  );

  useEffect(() => {
    if (!initialRenderDone) {
      setInitialRenderDone(true);
      return;
    }

    if (filterExpenses) {
      filterExpenses(
        filterStartDate,
        filterEndDate,
        filterCategories,
        sortOrder,
      );
    }
  }, [
    filterStartDate,
    filterEndDate,
    filterCategories,
    sortOrder,
    filterExpenses,
    initialRenderDone,
  ]);

  useEffect(() => {
    if (
      selectedAccount &&
      accounts.length > 0 &&
      !accounts.some(acc => acc.id === selectedAccount)
    ) {
      setSelectedAccount('');
    } else if (!selectedAccount && accounts.length > 0 && !visible) {
      const mainAccount = accounts.find(acc => acc.name === 'Main Account');
      if (mainAccount) {
        setSelectedAccount(mainAccount.id);
      } else {
        setSelectedAccount(accounts[0].id);
      }
    }
  }, [accounts, selectedAccount, visible]);

  useEffect(() => {
    if (currentSortOrder !== sortOrder) {
      setSortOrder(currentSortOrder);
    }
  }, [currentSortOrder, sortOrder]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const toggleOverlay = () => {
    if (visible) {
      setTitle('');
      setAmount('');
      setCategory('');
      setDate(new Date());
      setEditingId(null);
      setSelectedAccount('');
      manuallyOpened.current = false;
      setIsSubmitting(false);

      setTitleError('');
      setAmountError('');
      setAccountError('');
      setCategoryError('');
    } else {
      manuallyOpened.current = true;

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

  const toggleFilterOverlay = () => {
    if (isFilterVisible) {
      filterManuallyOpened.current = false;
    } else {
      filterManuallyOpened.current = true;
    }
    setIsFilterVisible(!isFilterVisible);
  };

  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newSortOrder);
    changeSortOrder(newSortOrder);
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const clearFilters = () => {
    setFilterStartDate(null);
    setFilterEndDate(null);
    setFilterCategories([]);
  };

  const toggleCategoryFilter = (category: string) => {
    setFilterCategories(prevCategories => {
      const updatedCategories = prevCategories.includes(category)
        ? prevCategories.filter(cat => cat !== category)
        : [...prevCategories, category];

      if (filterExpenses) {
        filterExpenses(
          filterStartDate,
          filterEndDate,
          updatedCategories,
          sortOrder,
        );
      }

      return updatedCategories;
    });
  };

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

  const handleEditExpense = (expense: any) => {
    manuallyOpened.current = true;

    setTitle(expense.title);
    setAmount(expense.amount.toString());
    setCategory(expense.category);
    setDate(expense.date);
    setEditingId(expense.id);
    setSelectedAccount(expense.account_id);
    setVisible(true);

    setTitleError('');
    setAmountError('');
    setAccountError('');
    setCategoryError('');
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

      toggleOverlay();

      if (editingId) {
        await updateExpense(editingId, {
          title,
          amount: expenseAmount,
          category,
          date,
          account_id: selectedAccount,
        });
      } else {
        const account = accounts.find(acc => acc.id === selectedAccount);
        if (account) {
          const updatedAccount = {
            ...account,
            balance: account.balance - expenseAmount,
          };

          const accountIndex = accounts.findIndex(
            acc => acc.id === selectedAccount,
          );
          const updatedAccounts = [...accounts];
          updatedAccounts[accountIndex] = updatedAccount;

          const addPromise = addExpense({
            title,
            amount: expenseAmount,
            category,
            date,
            account_id: selectedAccount,
            user_id: user.id,
          });

          const updatePromise = updateAccount(selectedAccount, {
            balance: account.balance - expenseAmount,
          });

          await Promise.all([addPromise, updatePromise]);
        } else {
          await addExpense({
            title,
            amount: expenseAmount,
            category,
            date,
            account_id: selectedAccount,
            user_id: user.id,
          });
        }
      }
    } catch (e) {
      console.error('Error saving expense:', e);
      Alert.alert('Error', 'Failed to save expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpense = (id: string) => {
    const expenseToDelete = expenses.find(expense => expense.id === id);

    if (!expenseToDelete) {
      Alert.alert('Error', 'Could not find expense to delete');
      return;
    }

    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletingExpenseIds(prev => [...prev, id]);

              await deleteExpense(id);

              const accountId = expenseToDelete.account_id;
              const amount = expenseToDelete.amount;

              const account = accounts.find(acc => acc.id === accountId);
              if (account) {
                await updateAccount(accountId, {
                  balance: account.balance + amount,
                });

                loadAccounts();
              }
            } catch (e) {
              console.error('Error deleting expense:', e);
              Alert.alert(
                'Error',
                'Failed to delete expense. Please try again.',
              );

              setDeletingExpenseIds(prev => prev.filter(expId => expId !== id));
            }
          },
        },
      ],
    );
  };

  const displayedExpenses = expenses.filter(
    expense => !deletingExpenseIds.includes(expense.id),
  );

  const renderHeader = () => (
    <View style={dynamicStyles.header}>
      <Text h4 style={dynamicStyles.headerTitle}>
        My Expenses
      </Text>
      <View style={dynamicStyles.themeToggle}>
        <Icon name="sun" type="feather" size={16} color={colors.headerText} />
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isDark ? '#ffffff' : '#f4f3f4'}
        />
        <Icon name="moon" type="feather" size={16} color={colors.headerText} />
      </View>
    </View>
  );

  const renderFilterActions = () => (
    <View style={dynamicStyles.filterActionRow}>
      <TouchableOpacity
        style={dynamicStyles.filterButton}
        onPress={toggleFilterOverlay}>
        <Icon name="filter" type="feather" size={16} color="#000000" />
        <Text style={dynamicStyles.filterButtonText}>Filter</Text>
        {(filterStartDate || filterEndDate || filterCategories.length > 0) && (
          <View style={dynamicStyles.activeFilterBadge} />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={dynamicStyles.sortButton}
        onPress={toggleSortOrder}>
        <Text style={dynamicStyles.sortButtonText}>
          Sort: {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
        </Text>
        <Icon
          name={sortOrder === 'desc' ? 'arrow-down' : 'arrow-up'}
          type="feather"
          size={16}
          color="#000000"
        />
      </TouchableOpacity>
    </View>
  );

  const renderActiveFilters = () => {
    if (!(filterStartDate || filterEndDate || filterCategories.length > 0)) {
      return null;
    }

    return (
      <View style={dynamicStyles.activeFiltersContainer}>
        <Text style={dynamicStyles.activeFiltersText}>
          Filtered by:
          {filterCategories.length > 0 ? ` ${filterCategories.join(', ')}` : ''}
          {filterStartDate ? ` from ${formatDate(filterStartDate)}` : ''}
          {filterEndDate ? ` to ${formatDate(filterEndDate)}` : ''}
        </Text>
      </View>
    );
  };

  const renderExpenseItem = ({item}: {item: any}) => (
    <Pressable onPress={() => handleEditExpense(item)}>
      <Card containerStyle={dynamicStyles.card}>
        <View style={dynamicStyles.cardHeader}>
          <Text style={dynamicStyles.cardTitle}>{item.title}</Text>
          <View style={dynamicStyles.actionButtons}>
            <TouchableOpacity
              style={dynamicStyles.editButton}
              onPress={() => handleEditExpense(item)}>
              <Icon
                name="edit"
                type="feather"
                size={18}
                color={colors.accent}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={dynamicStyles.deleteButton}
              onPress={() => handleDeleteExpense(item.id)}>
              <Icon
                name="trash-2"
                type="feather"
                size={18}
                color={colors.delete}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Divider style={dynamicStyles.divider} />
        <View style={dynamicStyles.cardContent}>
          <View>
            <Text style={dynamicStyles.date}>{formatDate(item.date)}</Text>
            <Text style={dynamicStyles.category}>{item.category}</Text>
          </View>
          <Text style={dynamicStyles.amount}>${item.amount.toFixed(2)}</Text>
        </View>
      </Card>
    </Pressable>
  );

  const renderEmptyList = () => (
    <View style={dynamicStyles.emptyList}>
      <Text style={dynamicStyles.emptyText}>
        No expenses yet. Add your first expense!
      </Text>
    </View>
  );

  const renderExpenseOverlay = () => (
    <Overlay
      isVisible={visible}
      onBackdropPress={toggleOverlay}
      overlayStyle={dynamicStyles.overlay}>
      <Text h4 style={dynamicStyles.overlayTitle}>
        {editingId ? 'Edit Expense' : 'Add New Expense'}
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
        inputStyle={dynamicStyles.inputText}
        labelStyle={dynamicStyles.inputLabel}
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
        inputStyle={dynamicStyles.inputText}
        labelStyle={dynamicStyles.inputLabel}
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
        inputStyle={dynamicStyles.inputText}
        labelStyle={dynamicStyles.inputLabel}
        label="Category"
        errorMessage={categoryError}
        errorStyle={{color: 'red', fontSize: 12}}
      />

      <Text style={dynamicStyles.sectionLabel}>Select Category</Text>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={dynamicStyles.categoriesScrollView}
        contentContainerStyle={dynamicStyles.categoriesScrollViewContent}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              dynamicStyles.categoryButton,
              category === cat && dynamicStyles.activeCategoryButton,
            ]}
            onPress={() => {
              setCategory(cat);
              setCategoryError('');
            }}>
            <Text
              style={[
                dynamicStyles.categoryText,
                category === cat && dynamicStyles.activeCategoryText,
              ]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={dynamicStyles.datePickerContainer}>
        <Text style={dynamicStyles.inputLabel}>Date</Text>
        <TouchableOpacity
          style={dynamicStyles.datePickerButton}
          onPress={toggleDatePicker}>
          <Text style={dynamicStyles.datePickerText}>{formatDate(date)}</Text>
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

      <Text style={dynamicStyles.inputLabel}>Account</Text>
      {accounts.length === 0 ? (
        <Text style={dynamicStyles.noAccountsText}>
          No accounts available. Please add an account first.
        </Text>
      ) : (
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={dynamicStyles.accountsScrollView}
          contentContainerStyle={dynamicStyles.accountsScrollViewContent}>
          {accounts.map(account => (
            <TouchableOpacity
              key={account.id}
              style={[
                dynamicStyles.accountButton,
                selectedAccount === account.id &&
                  dynamicStyles.selectedAccountButton,
                {borderLeftColor: account.color},
              ]}
              onPress={() => {
                setSelectedAccount(account.id);
                setAccountError('');
              }}>
              <Text
                style={[
                  dynamicStyles.accountButtonText,
                  selectedAccount === account.id &&
                    dynamicStyles.selectedAccountButtonText,
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
        title={editingId ? 'Update Expense' : 'Add Expense'}
        buttonStyle={dynamicStyles.addButton}
        titleStyle={dynamicStyles.addButtonText}
        onPress={handleAddExpense}
        disabled={isSubmitting}
      />
    </Overlay>
  );

  const renderFilterOverlay = () => (
    <Overlay
      isVisible={isFilterVisible}
      onBackdropPress={toggleFilterOverlay}
      overlayStyle={dynamicStyles.filterOverlay}>
      <View style={dynamicStyles.filterHeader}>
        <Text style={dynamicStyles.filterTitle}>Filter Expenses</Text>
        <TouchableOpacity
          onPress={toggleFilterOverlay}
          style={dynamicStyles.closeButton}>
          <Icon name="x" type="feather" size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      <Text style={dynamicStyles.filterLabel}>Category</Text>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={dynamicStyles.filterCategoriesContainer}
        contentContainerStyle={dynamicStyles.filterCategoriesContent}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              dynamicStyles.categoryButton,
              filterCategories.includes(cat) &&
                dynamicStyles.selectedCategoryButton,
            ]}
            onPress={e => {
              e.stopPropagation();
              toggleCategoryFilter(cat);
            }}>
            <Text
              style={[
                dynamicStyles.categoryText,
                filterCategories.includes(cat) &&
                  dynamicStyles.selectedCategoryText,
              ]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filterCategories.length > 0 && (
        <View style={dynamicStyles.selectedCategoriesContainer}>
          <Text style={dynamicStyles.selectedCategoriesText}>
            Selected: {filterCategories.join(', ')}
          </Text>
        </View>
      )}

      <Button
        title="Clear Filters"
        buttonStyle={dynamicStyles.clearFiltersButton}
        titleStyle={dynamicStyles.clearFiltersButtonText}
        onPress={clearFilters}
      />
    </Overlay>
  );

  return (
    <SafeAreaView style={dynamicStyles.container}>
      {renderHeader()}

      {renderFilterActions()}
      {renderActiveFilters()}

      <FlatList
        data={displayedExpenses}
        keyExtractor={item => item.id}
        renderItem={renderExpenseItem}
        ListEmptyComponent={renderEmptyList}
      />

      <FAB
        placement="right"
        icon={{name: 'add', color: '#000000'}}
        color={colors.accent}
        style={dynamicStyles.fab}
        onPress={toggleOverlay}
      />

      {renderExpenseOverlay()}
      {renderFilterOverlay()}

      {isLoading && (
        <View style={dynamicStyles.loadingOverlay}>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Expense;
