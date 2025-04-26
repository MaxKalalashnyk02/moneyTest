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
    themeToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    filterActionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
    },
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.accent,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 15,
      marginTop: 10,
      marginLeft: 10,
    },
    filterButtonText: {
      color: '#000000',
      marginLeft: 5,
      fontSize: 12,
    },
    activeFilterBadge: {
      position: 'absolute',
      top: -5,
      right: -5,
      backgroundColor: 'red',
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    sortButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.accent,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 15,
      alignSelf: 'flex-end',
      marginTop: 10,
      marginRight: 10,
    },
    sortButtonText: {
      color: '#000000',
      marginRight: 5,
      fontSize: 12,
    },
    activeFiltersContainer: {
      padding: 10,
      backgroundColor: colors.headerBackground,
      margin: 10,
      borderRadius: 5,
    },
    activeFiltersText: {
      color: colors.text,
      fontSize: 14,
    },
    card: {
      borderRadius: 10,
      marginHorizontal: 10,
      marginBottom: 10,
      padding: 15,
      backgroundColor: colors.card,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    divider: {
      marginVertical: 10,
    },
    cardContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    date: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    category: {
      color: colors.text,
      fontSize: 14,
      marginTop: 5,
    },
    amount: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    actionButtons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    editButton: {
      marginRight: 10,
    },
    deleteButton: {},
    fab: {
      marginBottom: 20,
    },
    emptyList: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 50,
    },
    emptyText: {
      color: 'gray',
      fontSize: 16,
    },
    loadingOverlay: {
      position: 'absolute',
      top: 150,
      left: 0,
      right: 0,
      zIndex: 1,
      pointerEvents: 'none',
    },
    filterOverlay: {
      width: '90%',
      padding: 20,
      borderRadius: 10,
      backgroundColor: colors.card,
    },
    filterHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
    },
    filterTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    closeButton: {
      padding: 5,
    },
    filterLabel: {
      color: colors.text,
      marginBottom: 5,
      fontSize: 14,
    },
    filterCategoriesContainer: {
      marginBottom: 10,
    },
    filterCategoriesContent: {
      paddingHorizontal: 0,
    },
    selectedCategoriesContainer: {
      marginVertical: 5,
    },
    selectedCategoriesText: {
      color: colors.text,
      fontSize: 12,
    },
    clearFiltersButton: {
      backgroundColor: '#ff6666',
    },
    clearFiltersButtonText: {
      color: '#000000',
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
    },
    sectionLabel: {
      color: colors.text,
      marginBottom: 5,
    },
    categoriesScrollView: {
      marginBottom: 15,
    },
    categoriesScrollViewContent: {
      paddingHorizontal: 5,
    },
    categoryButton: {
      backgroundColor: colors.category,
      padding: 8,
      borderRadius: 20,
      margin: 5,
    },
    selectedCategoryButton: {
      backgroundColor: colors.accent,
    },
    categoryText: {
      color: colors.categoryText,
    },
    selectedCategoryText: {
      color: '#000000',
    },
    activeCategoryButton: {
      backgroundColor: colors.accent,
    },
    activeCategoryText: {
      color: '#000000',
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
    noAccountsText: {
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 10,
    },
    accountsScrollView: {
      marginVertical: 10,
    },
    accountsScrollViewContent: {
      paddingHorizontal: 5,
    },
    accountButton: {
      backgroundColor: colors.category,
      padding: 8,
      borderRadius: 20,
      borderLeftWidth: 3,
    },
    selectedAccountButton: {
      backgroundColor: colors.accent,
    },
    accountButtonText: {
      color: colors.categoryText,
    },
    selectedAccountButtonText: {
      color: '#000000',
    },
    addButton: {
      backgroundColor: colors.accent,
      borderRadius: 5,
      padding: 10,
    },
    addButtonText: {
      color: '#000000',
    },
  });
