import {StyleSheet} from 'react-native';

export const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 15,
      backgroundColor: colors.headerBackground,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitle: {
      color: colors.headerText,
      fontWeight: 'bold',
    },
    card: {
      borderRadius: 10,
      marginHorizontal: 10,
      marginBottom: 10,
      padding: 15,
      borderLeftWidth: 5,
      backgroundColor: colors.card,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    cardSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
    },
    actionButtons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    editButton: {
      marginRight: 15,
    },
    deleteButton: {},
    divider: {
      marginVertical: 10,
      backgroundColor: colors.divider,
    },
    balance: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 5,
    },
    fab: {
      marginBottom: 20,
    },
    overlay: {
      width: '90%',
      padding: 20,
      borderRadius: 10,
      backgroundColor: colors.card,
    },
    overlayTitle: {
      marginBottom: 20,
      textAlign: 'center',
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
    },
    inputLabel: {
      color: colors.text,
      marginBottom: 5,
    },
    inputText: {
      color: colors.text,
    },
    currencyPicker: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginBottom: 20,
    },
    currencyButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      backgroundColor: colors.secondary,
      margin: 5,
    },
    selectedCurrency: {
      backgroundColor: colors.accent,
    },
    currencyText: {
      color: colors.text,
    },
    selectedCurrencyText: {
      color: colors.card,
      fontWeight: 'bold',
    },
    colorPicker: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginBottom: 20,
    },
    colorButton: {
      width: 30,
      height: 30,
      borderRadius: 15,
      margin: 8,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    selectedColor: {
      borderColor: colors.accent,
    },
    addButton: {
      backgroundColor: colors.accent,
      borderRadius: 5,
      padding: 10,
    },
    buttonTitle: {
      color: '#000000',
    },
    emptyList: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 50,
    },
    emptyText: {
      color: colors.textSecondary,
      fontSize: 16,
      textAlign: 'center',
    },
    totalBalanceContainer: {
      padding: 15,
      margin: 10,
      borderRadius: 10,
      backgroundColor: colors.card,
    },
    totalBalanceTitle: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    totalBalanceAmount: {
      color: colors.text,
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 5,
    },
    logoutButton: {
      backgroundColor: colors.delete,
      padding: 15,
      borderRadius: 10,
      margin: 10,
    },
    logoutText: {
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: 15,
      margin: 10,
      borderRadius: 10,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.accent,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    avatarText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.card,
    },
    userDetails: {
      flex: 1,
    },
    userName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    userEmail: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 5,
    },
    themeToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    currencyInfo: {
      color: colors.textSecondary,
      fontSize: 12,
      marginTop: 2,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      color: colors.text,
      marginBottom: 10,
    },
    leftIcon: {
      color: colors.text,
      marginRight: 5,
    },
  });
