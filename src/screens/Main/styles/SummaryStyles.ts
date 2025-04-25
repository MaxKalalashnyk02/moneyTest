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
    periodsContainer: {
      flexDirection: 'row',
      marginVertical: 15,
      paddingHorizontal: 10,
      gap: 10,
    },
    periodButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      backgroundColor: colors.secondary,
    },
    selectedPeriod: {
      backgroundColor: colors.accent,
    },
    periodText: {
      color: colors.text,
      fontSize: 14,
    },
    selectedPeriodText: {
      color: colors.card,
      fontWeight: 'bold',
    },
    summaryCard: {
      marginHorizontal: 10,
      marginVertical: 10,
      borderRadius: 10,
      backgroundColor: colors.card,
    },
    totalAmount: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginVertical: 10,
    },
    chartContainer: {
      alignItems: 'center',
      marginVertical: 10,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 5,
    },
    colorIndicator: {
      width: 16,
      height: 16,
      borderRadius: 8,
      marginRight: 8,
    },
    categoryName: {
      flex: 1,
      color: colors.text,
    },
    categoryAmount: {
      color: colors.text,
      fontWeight: 'bold',
    },
    categoryPercentage: {
      color: colors.textSecondary,
      marginLeft: 8,
      width: 40,
      textAlign: 'right',
    },
    divider: {
      marginVertical: 10,
    },
    noDataContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    noDataText: {
      color: colors.text,
      fontSize: 16,
      textAlign: 'center',
      paddingBottom: 10,
    },
    themeToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
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
    inputText: {
      color: colors.text,
    },
    inputLabel: {
      color: colors.text,
      marginLeft: 10,
      marginBottom: 5,
    },
    categoryButtons: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginBottom: 20,
    },
    categoryButton: {
      backgroundColor: colors.category,
      padding: 8,
      borderRadius: 20,
      margin: 5,
      marginHorizontal: 5,
    },
    selectedCategory: {
      backgroundColor: colors.categorySelected,
    },
    categoryText: {
      color: colors.categoryText,
    },
    selectedCategoryText: {
      color: colors.categorySelectedText,
    },
    datePickerContainer: {
      marginBottom: 20,
    },
    datePickerButton: {
      backgroundColor: colors.secondary,
      padding: 15,
      borderRadius: 5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 50,
    },
    datePickerText: {
      color: colors.text,
    },
    addButton: {
      backgroundColor: colors.accent,
      borderRadius: 5,
      padding: 10,
    },
    buttonTitle: {
      color: '#000000',
    },
    scrollContainer: {
      marginBottom: 15,
    },
    scrollContent: {
      paddingHorizontal: 5,
    },
    fab: {
      marginBottom: 20,
    },
    summaryDescription: {
      color: colors.textSecondary,
      textAlign: 'center',
    },
    legendContainer: {
      marginVertical: 10,
    },
    noAccountsText: {
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 10,
    },
    accountItem: {
      borderLeftWidth: 3,
    },
  });
