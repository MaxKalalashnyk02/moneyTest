import React, {useState, useCallback} from 'react';
import {
  View,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Switch,
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
import {useTheme} from '../../contexts/ThemeContext';
import {useAuth} from '../../contexts/AuthContext';
import {darkTheme, lightTheme} from '../../theme/colors';
import {useAccounts} from '../../hooks/useAccounts';
import {Account} from '../../services/accountService';
import {useFocusEffect} from '@react-navigation/native';
import {styles} from './styles/AccountsStyles';

const CURRENCIES = ['USD', 'UAH', 'EUR', 'GBP'];
const COLORS = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40',
];

// i simplified it, but in general it shows as it is in real life
const EXCHANGE_RATES = {
  USD: 1,
  UAH: 0.025,
  EUR: 1.09,
  GBP: 1.28,
};

const convertToUSD = (amount: number, currency: string): number => {
  return (
    amount * (EXCHANGE_RATES[currency as keyof typeof EXCHANGE_RATES] || 1)
  );
};

const formatCurrency = (amount: number, currency: string): string => {
  const symbol = getCurrencySymbol(currency);

  const formattedAmount = amount.toFixed(2);

  return `${symbol}${formattedAmount}`;
};

const getCurrencySymbol = (currency: string): string => {
  switch (currency) {
    case 'USD':
      return '$';
    case 'UAH':
      return '₴';
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    default:
      return '$';
  }
};

const Accounts = () => {
  const {toggleTheme, isDark} = useTheme();
  const {user, logout} = useAuth();

  const colors = isDark ? darkTheme : lightTheme;
  const stylesWithColors = styles(colors);

  const {
    accounts,
    addAccount,
    updateAccount,
    deleteAccount,
    isLoading,
    loadAccounts,
  } = useAccounts();

  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [balance, setBalance] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingAccountIds, setDeletingAccountIds] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadAccounts();
      return () => {};
    }, [loadAccounts]),
  );

  const toggleOverlay = () => {
    if (visible) {
      resetForm();
    }
    setVisible(!visible);
  };

  const resetForm = () => {
    setName('');
    setCurrency('USD');
    setBalance('');
    setSelectedColor(COLORS[0]);
    setEditingId(null);
    setIsSubmitting(false);
  };

  const handleAddAccount = async () => {
    if (isSubmitting) {
      return;
    }

    if (!user) {
      Alert.alert('Error', 'Please log in to add an account');
      return;
    }

    if (!name || !balance) {
      Alert.alert('Error', 'Name and balance are required');
      return;
    }

    if (
      !editingId &&
      name === 'Main Account' &&
      accounts.some(acc => acc.name === 'Main Account')
    ) {
      Alert.alert('Error', 'Main Account already exists');
      return;
    }

    try {
      setIsSubmitting(true);

      if (editingId) {
        await updateAccount(editingId, {
          name,
          currency,
          balance: parseFloat(balance),
          color: selectedColor,
        });
      } else {
        await addAccount({
          name,
          currency,
          balance: parseFloat(balance),
          color: selectedColor,
          user_id: user.id,
        });
      }

      toggleOverlay();
    } catch (e) {
      console.error('Error saving account:', e);
      Alert.alert('Error', 'Failed to save account. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleEditAccount = (account: Account) => {
    setName(account.name);
    setCurrency(account.currency);
    setBalance(account.balance.toString());
    setSelectedColor(account.color);
    setEditingId(account.id);
    setVisible(true);
  };

  const handleDeleteAccount = (id: string) => {
    const accountToDelete = accounts.find(acc => acc.id === id);

    if (accountToDelete?.name === 'Main Account') {
      Alert.alert('Error', 'Main Account cannot be deleted');
      return;
    }

    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete this account? This will also delete all expenses associated with this account.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletingAccountIds(prev => [...prev, id]);

              await deleteAccount(id);
            } catch (e) {
              console.error('Error deleting account:', e);
              Alert.alert(
                'Error',
                'Failed to delete account. Please try again.',
              );

              setDeletingAccountIds(prev => prev.filter(accId => accId !== id));
            }
          },
        },
      ],
    );
  };

  const displayedAccounts = accounts.filter(
    account => !deletingAccountIds.includes(account.id),
  );

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  const totalBalance = accounts.reduce((sum, account) => {
    return sum + convertToUSD(account.balance, account.currency);
  }, 0);

  const renderHeader = () => (
    <View style={stylesWithColors.header}>
      <Text h4 style={stylesWithColors.headerTitle}>
        My Accounts
      </Text>
      <View style={stylesWithColors.themeToggle}>
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

  const renderUserInfo = () => {
    if (!user) {
      return null;
    }

    return (
      <View style={stylesWithColors.userInfo}>
        <View style={stylesWithColors.avatar}>
          <Text style={stylesWithColors.avatarText}>
            {user.user_metadata?.name
              ? user.user_metadata.name.charAt(0).toUpperCase()
              : user.email?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <View style={stylesWithColors.userDetails}>
          <Text style={stylesWithColors.userName}>
            {user.user_metadata?.name || 'User'}
          </Text>
          <Text style={stylesWithColors.userEmail}>{user.email}</Text>
        </View>
      </View>
    );
  };

  const renderTotalBalance = () => (
    <View style={stylesWithColors.totalBalanceContainer}>
      <Text style={stylesWithColors.totalBalanceTitle}>
        Total Balance (USD)
      </Text>
      <Text style={stylesWithColors.totalBalanceAmount}>
        ${totalBalance.toFixed(2)}
      </Text>
      <Text style={stylesWithColors.currencyInfo}>
        *All currencies converted to USD equivalent
      </Text>
    </View>
  );

  const renderAccountItem = ({item}: {item: Account}) => (
    <Card
      containerStyle={[stylesWithColors.card, {borderLeftColor: item.color}]}>
      <View style={stylesWithColors.cardHeader}>
        <View>
          <Text style={stylesWithColors.cardTitle}>{item.name}</Text>
          <Text style={stylesWithColors.cardSubtitle}>{item.currency}</Text>
        </View>
        <View style={stylesWithColors.actionButtons}>
          <TouchableOpacity
            style={stylesWithColors.editButton}
            onPress={() => handleEditAccount(item)}>
            <Icon name="edit" type="feather" size={20} color={colors.accent} />
          </TouchableOpacity>
          <TouchableOpacity
            style={stylesWithColors.deleteButton}
            onPress={() => handleDeleteAccount(item.id)}>
            <Icon
              name="trash-2"
              type="feather"
              size={20}
              color={colors.delete}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Divider style={stylesWithColors.divider} />
      <Text style={stylesWithColors.balance}>
        {formatCurrency(item.balance, item.currency)}
      </Text>
    </Card>
  );

  const renderEmptyList = () => (
    <View style={stylesWithColors.emptyList}>
      <Text style={stylesWithColors.emptyText}>
        No accounts yet. Add your first account!
      </Text>
    </View>
  );

  const renderLoading = () => (
    <View style={stylesWithColors.loadingContainer}>
      <Text style={stylesWithColors.loadingText}>Loading accounts...</Text>
    </View>
  );

  const renderAccountForm = () => (
    <Overlay
      isVisible={visible}
      onBackdropPress={toggleOverlay}
      overlayStyle={stylesWithColors.overlay}>
      <Text style={stylesWithColors.overlayTitle}>
        {editingId ? 'Edit Account' : 'Add New Account'}
      </Text>

      <Input
        placeholder="Account Name"
        value={name}
        onChangeText={setName}
        inputStyle={stylesWithColors.inputText}
        labelStyle={stylesWithColors.inputLabel}
        label="Account Name"
      />

      <Text style={stylesWithColors.inputLabel}>Currency</Text>
      <View style={stylesWithColors.currencyPicker}>
        {CURRENCIES.map(curr => (
          <TouchableOpacity
            key={curr}
            style={[
              stylesWithColors.currencyButton,
              currency === curr && stylesWithColors.selectedCurrency,
            ]}
            onPress={() => setCurrency(curr)}>
            <Text
              style={[
                stylesWithColors.currencyText,
                currency === curr && stylesWithColors.selectedCurrencyText,
              ]}>
              {curr}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Input
        placeholder="Initial Balance"
        value={balance}
        onChangeText={setBalance}
        keyboardType="numeric"
        inputStyle={stylesWithColors.inputText}
        labelStyle={stylesWithColors.inputLabel}
        label="Initial Balance"
        leftIcon={
          <Text style={stylesWithColors.leftIcon}>
            {getCurrencySymbol(currency)}
          </Text>
        }
      />

      <Text style={stylesWithColors.inputLabel}>Account Color</Text>
      <View style={stylesWithColors.colorPicker}>
        {COLORS.map(color => (
          <TouchableOpacity
            key={color}
            style={[
              stylesWithColors.colorButton,
              {backgroundColor: color},
              selectedColor === color && stylesWithColors.selectedColor,
            ]}
            onPress={() => setSelectedColor(color)}
          />
        ))}
      </View>

      <Button
        title={editingId ? 'Update Account' : 'Add Account'}
        buttonStyle={stylesWithColors.addButton}
        onPress={handleAddAccount}
        titleStyle={stylesWithColors.buttonTitle}
        disabled={isSubmitting}
      />
    </Overlay>
  );

  return (
    <SafeAreaView style={stylesWithColors.container}>
      {renderHeader()}

      {renderUserInfo()}

      {renderTotalBalance()}

      {isLoading ? (
        renderLoading()
      ) : (
        <FlatList
          data={displayedAccounts}
          keyExtractor={item => item.id}
          renderItem={renderAccountItem}
          ListEmptyComponent={renderEmptyList}
        />
      )}

      <TouchableOpacity
        style={stylesWithColors.logoutButton}
        onPress={handleLogout}>
        <Text style={stylesWithColors.logoutText}>Logout</Text>
      </TouchableOpacity>

      <FAB
        placement="right"
        icon={{name: 'add', color: '#000000'}}
        color={colors.accent}
        style={stylesWithColors.fab}
        onPress={toggleOverlay}
      />

      {renderAccountForm()}
    </SafeAreaView>
  );
};

export default Accounts;
