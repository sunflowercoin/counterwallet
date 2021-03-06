INIT_FUNC = {};

function initIndex() { //main page
  window.LOGON_VIEW_MODEL = new LogonViewModel();
  window.LOGON_PASSWORD_MODAL = new LogonPasswordModalViewModel();
  
  window.WALLET = new WalletViewModel();
  window.WALLET_OPTIONS_MODAL = new WalletOptionsModalViewModel();
  
  window.MESSAGE_FEED = new MessageFeed();
  window.CHAT_FEED = new ChatFeedViewModel();
  window.CHAT_SET_HANDLE_MODAL = new ChatSetHandleModalViewModel();
  window.PENDING_ACTION_FEED = new PendingActionFeedViewModel();
  
  window.UPCOMING_BTCPAY_FEED = new UpcomingBTCPayFeedViewModel();
  window.WAITING_BTCPAY_FEED = new WaitingBTCPayFeedViewModel();
  window.BTCPAY_FEED = new BTCPayFeedViewModel();
  
  window.OPEN_ORDER_FEED = new OpenOrderFeedViewModel();
  window.NOTIFICATION_FEED = new NotificationFeedViewModel();
  
  $(document).ready(function() {
    ko.applyBindings(LOGON_VIEW_MODEL, document.getElementById("logon"));
    ko.applyBindings(LOGON_PASSWORD_MODAL, document.getElementById("logonPassphaseModal"));
    ko.applyBindings(WALLET_OPTIONS_MODAL, document.getElementById("walletOptionsModal"));
    ko.applyBindings(CHAT_FEED, document.getElementById("chatPane"));
    ko.applyBindings(CHAT_SET_HANDLE_MODAL, document.getElementById("chatSetHandleModal"));
    ko.applyBindings(PENDING_ACTION_FEED, document.getElementById("pendingActionFeed"));
    ko.applyBindings(BTCPAY_FEED, document.getElementById("btcPayFeed"));
    ko.applyBindings(OPEN_ORDER_FEED, document.getElementById("openOrderFeed"));
    ko.applyBindings(NOTIFICATION_FEED, document.getElementById("notificationFeed"));        
            
    //so that knockout is run on the DOM sections and global context is accessible...
    ko.applyBindings({}, document.getElementById("noticeTestnet"));
    ko.applyBindings({}, document.getElementById("noticeDevMode"));
    
    $('#fullscreen').click(function(e) {
      launchFullscreen(document.documentElement);
      return false;
    });
    $('#showOptions').click(function(e) {
      WALLET_OPTIONS_MODAL.show();
      return false;
    });
  });
}
initIndex(); //call it now, as this script is loaded on index page load


function initBalances() {
  ko.applyBindings(WALLET, document.getElementsByClassName("balancesContainer")[0]);
  //^ this line MUST go above pageSetup() in this case, or odd things will happen
  
  pageSetUp(); //init smartadmin featureset
   
  //balances.js
  window.CHANGE_ADDRESS_LABEL_MODAL = new ChangeAddressLabelModalViewModel();
  window.CREATE_NEW_ADDRESS_MODAL = new CreateNewAddressModalViewModel();
  window.SEND_MODAL = new SendModalViewModel();
  window.SWEEP_MODAL = new SweepModalViewModel();
  window.SIGN_MESSAGE_MODAL = new SignMessageModalViewModel();
  window.TESTNET_BURN_MODAL = new TestnetBurnModalViewModel();
  window.DISPLAY_PRIVATE_KEY_MODAL = new DisplayPrivateKeyModalViewModel();
  
  ko.applyBindings({}, document.getElementById("gettingStartedNotice"));
  ko.applyBindings({}, document.getElementById("pendingBTCPayNotice"));
  ko.applyBindings(CHANGE_ADDRESS_LABEL_MODAL, document.getElementById("changeAddressLabelModal"));
  ko.applyBindings(CREATE_NEW_ADDRESS_MODAL, document.getElementById("createNewAddressModal"));
  ko.applyBindings(SEND_MODAL, document.getElementById("sendModal"));
  ko.applyBindings(SWEEP_MODAL, document.getElementById("sweepModal"));
  ko.applyBindings(SIGN_MESSAGE_MODAL, document.getElementById("signMessageModal"));
  ko.applyBindings(TESTNET_BURN_MODAL, document.getElementById("testnetBurnModal"));
  ko.applyBindings(DISPLAY_PRIVATE_KEY_MODAL, document.getElementById("displayPrivateKeyModal"));
    
  //balances_assets.js
  window.CREATE_ASSET_MODAL = new CreateAssetModalViewModel();
  window.ISSUE_ADDITIONAL_ASSET_MODAL = new IssueAdditionalAssetModalViewModel();
  window.TRANSFER_ASSET_MODAL = new TransferAssetModalViewModel();
  window.CHANGE_ASSET_DESCRIPTION_MODAL = new ChangeAssetDescriptionModalViewModel();
  window.PAY_DIVIDEND_MODAL = new PayDividendModalViewModel();
  window.CALL_ASSET_MODAL = new CallAssetModalViewModel();
  window.SHOW_ASSET_INFO_MODAL = new ShowAssetInfoModalViewModel();
  
  ko.applyBindings(CREATE_ASSET_MODAL, document.getElementById("createAssetModal"));
  ko.applyBindings(ISSUE_ADDITIONAL_ASSET_MODAL, document.getElementById("issueAdditionalAssetModal"));
  ko.applyBindings(TRANSFER_ASSET_MODAL, document.getElementById("transferAssetModal"));
  ko.applyBindings(CHANGE_ASSET_DESCRIPTION_MODAL, document.getElementById("changeAssetDescriptionModal"));
  ko.applyBindings(PAY_DIVIDEND_MODAL, document.getElementById("payDividendModal"));
  ko.applyBindings(CALL_ASSET_MODAL, document.getElementById("callAssetModal"));
  ko.applyBindings(SHOW_ASSET_INFO_MODAL, document.getElementById("showAssetInfoModal"));
  
  $(document).ready(function() {
      //Some misc jquery event handlers
      $('#createAddress, #createWatchOnlyAddress').click(function(e) {
        if(WALLET.addresses().length >= MAX_ADDRESSES) {
          bootbox.alert("You already have the max number of addresses for a single wallet (<b>"
            + MAX_ADDRESSES + "</b>). Please create a new wallet (i.e. different passphrase) for more.");
          return false;
        }
        CREATE_NEW_ADDRESS_MODAL.show($(this).attr('id') == 'createWatchOnlyAddress');
        e.preventDefault(); //prevent the location hash from changing
      });
      
      $('#sweepFunds').click(function() {
        SWEEP_MODAL.show();
      });
        
      //Called on first load, and every switch back to the balances page
      if(window._BALANCES_HAS_LOADED_ALREADY === undefined) {
          window._BALANCES_HAS_LOADED_ALREADY = true;
      } else {
          WALLET.refreshBTCBalances(false);
      }
  });
}
INIT_FUNC['pages/balances.html'] = initBalances;


function initBuySell() {
  pageSetUp(); //init smartadmin featureset
  
  //This code is run on each visit to the page
  window.BUY_SELL = new BuySellWizardViewModel();
  
  ko.applyBindings(BUY_SELL, document.getElementsByClassName("buySellGrid")[0]);
    
  BUY_SELL.init();
  
  $(window).resize(BUY_SELL.dataTableResponsive);
  $(window).on('hashchange', function() {
    BUY_SELL._tab2StopAutoRefresh(); //just in case
    $(window).off("resize", BUY_SELL.dataTableResponsive);
  });
  
  //due to CSP, we can't use javascript:void(0) anymore...so prevent wizard links from resetting the location hash here
  $('#buySellWizard .pager .next, #buySellWizard .pager .previous').click(function(e) {
    e.preventDefault();
  });
}
INIT_FUNC['pages/buysell.html'] = initBuySell;


function initFeedBTCPays() {
  ko.applyBindings(WAITING_BTCPAY_FEED, document.getElementById("waitingBTCPayFeedContent"));
  ko.applyBindings(UPCOMING_BTCPAY_FEED, document.getElementById("upcomingBTCPayFeedContent"));
}
INIT_FUNC['pages/feed_btcpays.html'] = initFeedBTCPays;


function initFeedNotifications() {
  ko.applyBindings(NOTIFICATION_FEED, document.getElementById("notificationFeedContent"));
}
INIT_FUNC['pages/feed_notifications.html'] = initFeedNotifications;


function initFeedOpenOrders() {
  ko.applyBindings(OPEN_ORDER_FEED, document.getElementById("openOrderFeedContent"));
}
INIT_FUNC['pages/feed_open_orders.html'] = initFeedOpenOrders;


function initFeedPendingActions() {
  ko.applyBindings(PENDING_ACTION_FEED, document.getElementById("pendingActionFeedContent"));
}
INIT_FUNC['pages/feed_pending_actions.html'] = initFeedPendingActions;


function initHistory() {
  pageSetUp(); //init smartadmin featureset
  
  //This code is run on each visit to the page
  window.BALANCE_HISTORY = new BalanceHistoryViewModel();
  window.TXN_HISTORY = new TransactionHistoryViewModel();
  
  ko.applyBindings(TXN_HISTORY, document.getElementById("wid-id-txnHistory"));
  ko.applyBindings(BALANCE_HISTORY, document.getElementById("wid-id-balHistory"));
  
  BALANCE_HISTORY.init();
  TXN_HISTORY.init();
    
  $(window).bind("resize", TXN_HISTORY.dataTableResponsive);
  $(window).on('hashchange', function() {
    $(window).off("resize", TXN_HISTORY.dataTableResponsive);
  });
}
INIT_FUNC['pages/history.html'] = initHistory;


function initStats() {
  pageSetUp(); //init smartadmin featureset
  
  //This code is run on each visit to the page
  window.STATS_HISTORY = new StatsHistoryViewModel();
  window.STATS_TXN_HISTORY = new StatsTransactionHistoryViewModel();
  
  ko.applyBindings(STATS_TXN_HISTORY, document.getElementById("wid-id-statsTxnHistory"));
  ko.applyBindings(STATS_HISTORY, document.getElementById("wid-id-statsHistory"));
  
  STATS_HISTORY.init();
  STATS_TXN_HISTORY.init();
}
INIT_FUNC['pages/stats.html'] = initStats;


function initLeaderboard() {
  pageSetUp(); //init smartadmin featureset
  
  //This code is run on each visit to the page
  window.ASSET_LEADERBOARD = new AssetLeaderboardViewModel();
  
  ko.applyBindings(ASSET_LEADERBOARD, document.getElementById("leaderboardButtonBar"));
  ko.applyBindings(ASSET_LEADERBOARD, document.getElementsByClassName("leaderboardGrid")[0]);
  
  ASSET_LEADERBOARD.init();
  
  $(window).bind("resize", ASSET_LEADERBOARD.dataTableResponsive);
  $(window).on('hashchange', function() {
    $(window).off("resize", ASSET_LEADERBOARD.dataTableResponsive);
  });
}
INIT_FUNC['pages/leaderboard.html'] = initLeaderboard;


function initOrders() {
  pageSetUp(); //init smartadmin featureset
  
  //This code is run on each visit to the page
  window.ORDERS = new OrdersViewModel();
  ko.applyBindings(ORDERS, document.getElementsByClassName("ordersGrid")[0]);
  
  ORDERS.init(true);
  
  $(window).resize(ORDERS.dataTableResponsive);
  $(window).on('hashchange', function() {
    ORDERS.metricsStopAutoRefresh(); //just in case
    $(window).off("resize", ORDERS.dataTableResponsive);
  });
}
INIT_FUNC['pages/orders.html'] = initOrders;


function initPortfolio() {
  pageSetUp(); //init smartadmin featureset
  
  //This code is run on each visit to the page
  window.ASSET_PORTFOLIO = new AssetPortfolioViewModel("Test");
  
  ko.applyBindings(ASSET_PORTFOLIO, document.getElementById("portfolioButtonBar"));
  ko.applyBindings(ASSET_PORTFOLIO, document.getElementsByClassName("portfolioGrid")[0]);
  
  $(window).bind("resize", ASSET_PORTFOLIO.dataTableResponsive);
  $(window).on('hashchange', function() {
    $(window).off("resize", ASSET_PORTFOLIO.dataTableResponsive);
  });
}
INIT_FUNC['pages/portfolio.html'] = initPortfolio;
