import Vue from 'vue'
let rolePermissions = {
    "admin": {
        // sales
        viewSale: true,
        createSale: true,
        editSale: true,
        deleteSale: true,
        // purchases
        viewPurchase: true,
        createPurchase: true,
        editPurchase: true,
        deletePurchase: true,
        // expenses
        viewExpense: true,
        createExpense: true,
        editExpense: true,
        deleteExpense: true,
        // parties-customer
        viewPartiesCustomer: true,
        createPartiesCustomer: true,
        editPartiesCustomer: true,
        deletePartiesCustomer: true,
        // parties-supplier
        viewPartiesSupplier: true,
        createPartiesSupplier: true,
        editPartiesSupplier: true,
        deletePartiesSupplier: true,
        // business stats
        viewBusinessStats: true,
        // currentBusiness
        editCurrentBusiness: true,
        deleteCurrentBusiness: true,
        // inventory
        viewInventory: true,
        createInventory: true,
        editInventory: true,
        deleteInventory: true,
        // item stock adjustment
        createAdjustment: true,
        // manage staff
        addStaff: true,
        editStaff: true,
        removeStaff: true,
        viewAllStaff: true,
        // Karobar Settings
        accountSettings: true,
        businessSettings: true,
        invoiceSettings: true,
        deleteBusiness: true,
        // Reports
        transactionsReport: true,
        partyReport: true,
        allPartyReport: true,
        itemStockReport: true,
        expenseReport: true,
        businessStatsReport: true,
        // keyboard shortcuts
        keyboardShortcuts: true,
        // cash in hand
        viewCash: true,
        addReduceCash: true,
        editDeleteCash: true,
        // bank balance
        viewBank: true,
        addReduceBank: true,
        editDeleteBank: true,
        //import
        importData: true,
        // subscription
        showSubscription: true
    },
    "business-partner": {
        // sales
        viewSale: true,
        createSale: true,
        editSale: true,
        deleteSale: true,
        // purchases
        viewPurchase: true,
        createPurchase: true,
        editPurchase: true,
        deletePurchase: true,
        // expenses
        viewExpense: true,
        createExpense: true,
        editExpense: true,
        deleteExpense: true,
        // parties-customer
        viewPartiesCustomer: true,
        createPartiesCustomer: true,
        editPartiesCustomer: true,
        deletePartiesCustomer: true,
        // parties-supplier
        viewPartiesSupplier: true,
        createPartiesSupplier: true,
        editPartiesSupplier: true,
        deletePartiesSupplier: true,
        // business stats
        viewBusinessStats: true,
        // currentBusiness
        editCurrentBusiness: true,
        deleteCurrentBusiness: false,
        // inventory
        viewInventory: true,
        createInventory: true,
        editInventory: true,
        deleteInventory: true,
        // item stock adjustment
        createAdjustment: true,
        // manage staff
        addStaff: false,
        editStaff: false,
        removeStaff: false,
        viewAllStaff: true,
        // Karobar Settings
        accountSettings: true,
        businessSettings: false,
        invoiceSettings: true,
        deleteBusiness: false,
        // Reports
        transactionsReport: true,
        partyReport: true,
        allPartyReport: true,
        itemStockReport: true,
        expenseReport: true,
        businessStatsReport: true,
        // keyboard shortcuts
        keyboardShortcuts: true,
        // cash in hand
        viewCash: true,
        addReduceCash: true,
        editDeleteCash: true,
        // bank balance
        viewBank: true,
        addReduceBank: true,
        editDeleteBank: true,
        //import
        importData: true,
        // subscription
        showSubscription: false
    },
    "sales-person": {
        // sales
        viewSale: true,
        createSale: true,
        editSale: true,
        deleteSale: false,
        // purchases
        viewPurchase: false,
        createPurchase: false,
        editPurchase: false,
        deletePurchase: false,
        // expenses
        viewExpense: true,
        createExpense: true,
        editExpense: true,
        deleteExpense: false,
        // parties-customer
        viewPartiesCustomer: true,
        createPartiesCustomer: true,
        editPartiesCustomer: true,
        deletePartiesCustomer: false,
        // parties-supplier
        viewPartiesSupplier: false,
        createPartiesSupplier: false,
        editPartiesSupplier: false,
        deletePartiesSupplier: false,
        // business stats
        viewBusinessStats: false,
        // currentBusiness
        editCurrentBusiness: false,
        deleteCurrentBusiness: false,
        // inventory
        viewInventory: true,
        createInventory: false,
        editInventory: false,
        deleteInventory: false,
        // item stock adjustment
        createAdjustment: false,
        // manage staff
        addStaff: false,
        editStaff: false,
        removeStaff: false,
        viewAllStaff: true,
        // Karobar Settings
        accountSettings: true,
        businessSettings: false,
        invoiceSettings: true,
        deleteBusiness: false,
        // Reports
        transactionsReport: false,
        partyReport: true,
        allPartyReport: false,
        itemStockReport: false,
        expenseReport: false,
        businessStatsReport: false,
        // keyboard shortcuts
        keyboardShortcuts: true,
        // cash in hand
        viewCash: false,
        addReduceCash: false,
        editDeleteCash: false,
        // bank balance
        viewBank: false,
        addReduceBank: false,
        editDeleteBank: false,
        //import
        importData: false,
        // subscription
        showSubscription: false
    },
    "inventory-manager": {
        // sales
        viewSale: true,
        createSale: false,
        editSale: false,
        deleteSale: false,
        // purchases
        viewPurchase: true,
        createPurchase: true,
        editPurchase: true,
        deletePurchase: false,
        // expenses
        viewExpense: true,
        createExpense: true,
        editExpense: true,
        deleteExpense: false,
        // parties-customer
        viewPartiesCustomer: false,
        createPartiesCustomer: false,
        editPartiesCustomer: false,
        deletePartiesCustomer: false,
        // parties-supplier
        viewPartiesSupplier: true,
        createPartiesSupplier: true,
        editPartiesSupplier: true,
        deletePartiesSupplier: false,
        // business stats
        viewBusinessStats: false,
        // currentBusiness
        editCurrentBusiness: false,
        deleteCurrentBusiness: false,
        // inventory
        viewInventory: true,
        createInventory: true,
        editInventory: true,
        deleteInventory: false,
        // item stock adjustment
        createAdjustment: true,
        // manage staff
        addStaff: false,
        editStaff: false,
        removeStaff: false,
        viewAllStaff: true,
        // Karobar Settings
        accountSettings: true,
        businessSettings: false,
        invoiceSettings: false,
        deleteBusiness: false,
        // Reports
        transactionsReport: false,
        partyReport: true,
        allPartyReport: false,
        itemStockReport: true,
        expenseReport: false,
        businessStatsReport: false,
        // keyboard shortcuts
        keyboardShortcuts: true,
        // cash in hand
        viewCash: false,
        addReduceCash: false,
        editDeleteCash: false,
        // bank balance
        viewBank: false,
        addReduceBank: false,
        editDeleteBank: false,
        //import
        importData: false,
        // subscription
        showSubscription: false
    },
    "accountant": {
        // sales
        viewSale: false,
        createSale: false,
        editSale: false,
        deleteSale: false,
        // purchases
        viewPurchase: false,
        createPurchase: false,
        editPurchase: false,
        deletePurchase: false,
        // expenses
        viewExpense: false,
        createExpense: false,
        editExpense: false,
        deleteExpense: false,
        // parties-customer
        viewPartiesCustomer: false,
        createPartiesCustomer: false,
        editPartiesCustomer: false,
        deletePartiesCustomer: false,
        // parties-supplier
        viewPartiesSupplier: false,
        createPartiesSupplier: false,
        editPartiesSupplier: false,
        deletePartiesSupplier: false,
        // business stats
        viewBusinessStats: false,
        // currentBusiness
        editCurrentBusiness: false,
        deleteCurrentBusiness: false,
        // inventory
        viewInventory: false,
        createInventory: false,
        editInventory: false,
        deleteInventory: false,
        // item stock adjustment
        createAdjustment: false,
        // manage staff
        addStaff: false,
        editStaff: false,
        removeStaff: false,
        viewAllStaff: false,
        // Karobar Settings
        accountSettings: true,
        businessSettings: false,
        invoiceSettings: false,
        deleteBusiness: false,
        // Reports
        transactionsReport: true,
        partyReport: true,
        allPartyReport: true,
        itemStockReport: true,
        expenseReport: true,
        businessStatsReport: true,
        // keyboard shortcuts
        keyboardShortcuts: true,
        // cash in hand
        viewCash: false,
        addReduceCash: false,
        editDeleteCash: false,
        // bank balance
        viewBank: false,
        addReduceBank: false,
        editDeleteBank: false,
        //import
        importData: false,
        // subscription
        showSubscription: false
    }
}
const MyPlugin = {
    install(Vue) {
        Vue.prototype.globalHelper = (value) => {
            let role = localStorage.getItem("role")
            return rolePermissions[role][value]
        },
            Vue.prototype.globalPartyReport = (type) => {
                let role = localStorage.getItem("role")
                if (role == "inventory-manager" || role == "sales-person") {
                    if (type == 5) {
                        return true
                    }
                    else {
                        return false
                    }
                }
                return true
            }
        Vue.prototype.conversion = (num) => {
            let pureNumber = Number(num)
            let condtion = Math.floor(pureNumber) === pureNumber;
            let number = 0;
            if (condtion) {
                number = Math.floor(pureNumber).toLocaleString("en-IN");
            } else {
                number = pureNumber.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            }
            return number;
        }
        Vue.prototype.toNumber = (event) => {
            if (event) {
                let value = event.target.value;
                if (value.includes(".")) {
                    const [integerPart, decimalPart] = value.split(".");
                    event.target.value = `${integerPart.slice(0, 8)}.${decimalPart.slice(
                        0,
                        2
                    )}`;
                } else if (value.length > 8) {
                    event.target.value = value.slice(0, 8);
                }
            }

        }

    },
}
Vue.use(MyPlugin)
