import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import moment from 'moment';

import { AppContext } from '../../AppProvider';
import { withTranslation } from '../../hooks/useTranslations';
import theme from '../../component-library/Global/theme';
import {
  TRANSACTION_TYPE,
  TYPES_MAP,
  TOKEN_DECIMALS,
  MLN_ICON,
} from './constants';
import { cache, invalidate, CACHE_TYPES } from '../../utils/cache';
// import { LOGOS } from '../../utils/wallet';
import { globalStyles } from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import CardButtonTransaction from '../../component-library/CardButton/CardButtonTransaction';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalSkeleton from '../../component-library/Global/GlobalSkeleton';
// import AvatarImage from '../../component-library/Image/AvatarImage';
import IconFailed from '../../assets/images/IconFailed.png';
import IconSuccess from '../../assets/images/IconSuccessGreen.png';
import Header from '../../component-library/Layout/Header';

import { ROUTES_MAP } from './routes';
import { useNavigation } from '../../routes/hooks';

import useAnalyticsEventTracker from '../../hooks/useAnalyticsEventTracker';
import { SECTIONS_MAP } from '../../utils/tracking';

const styles = StyleSheet.create({
  titleStyle: {
    marginTop: theme.gutters.paddingNormal,
    marginLeft: theme.gutters.paddingSM,
    marginRight: theme.gutters.paddingSM,
  },
  dateStyle: {
    lineHeight: theme.gutters.padding3XL,
  },
  dateStyleFirst: {
    marginBottom: theme.gutters.paddingSM,
  },
  inline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyStyle: {
    marginTop: 10,
  },
});

const TransactionsListPage = ({ t }) => {
  const navigate = useNavigation();
  const onDetail = id => navigate(ROUTES_MAP.TRANSACTIONS_DETAIL, { id });
  const [{ activeWallet, selectedEndpoints, config }] = useContext(AppContext);
  const [recentTransactions, setRecentTransactions] = useState({});
  const [lastTransaction, setLastTransaction] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useAnalyticsEventTracker(SECTIONS_MAP.TRANSACTIONS_LIST);

  useEffect(() => {
    if (activeWallet) {
      Promise.all([
        cache(
          `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
          CACHE_TYPES.TRANSACTIONS,
          () => activeWallet.getRecentTransactions(),
        ),
      ]).then(([recTransactions]) => {
        setRecentTransactions(recTransactions);
        setLastTransaction(recTransactions?.slice(-1).pop());
        setLoaded(true);
        // m17 temp tracking
        console.log('recTransactions: ', recTransactions);
      });
    }
  }, [activeWallet, selectedEndpoints]);

  const onLoadMore = () => {
    setLoading(true);
    Promise.resolve(
      activeWallet.getRecentTransactions(lastTransaction.signature),
    ).then(recTransactions => {
      invalidate(CACHE_TYPES.TRANSACTIONS);
      cache(
        `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
        CACHE_TYPES.TRANSACTIONS,
        () => recentTransactions.concat(recTransactions),
      );
      setLastTransaction(recTransactions.slice(-1).pop());
      setRecentTransactions(recentTransactions.concat(recTransactions));
      setLoading(false);
    });
  };

  const showDate = (recTrans, i) => {
    let lastTransDate;
    i === 0
      ? (lastTransDate = null)
      : (lastTransDate = moment
          .unix(recTrans[i - 1].timestamp)
          .format('MMM D, YYYY')); // MI, vanilla: format('MMM D, YYYY')
    const thisTransDate = moment
      .unix(recTrans[i].timestamp)
      .format('MMM D, YYYY'); // MI, vanilla: format('MMM D, YYYY')
    const yesterday = moment().subtract(1, 'days').format('MMM D, YYYY'); // MI, vanilla: format('MMM D, YYYY')
    const today = moment().format('MMM D, YYYY'); // MI, vanilla: format('MMM D, YYYY')
    if (thisTransDate !== lastTransDate) {
      return thisTransDate === today
        ? t('transactions.today')
        : thisTransDate === yesterday
        ? t('transactions.yesterday')
        : thisTransDate;
    } else {
      return null;
    }
  };

  const showLoadMore = () =>
    recentTransactions?.length &&
    recentTransactions?.length % 8 === 0 &&
    loaded &&
    !loading;

  const Empty = () => (
    <GlobalText
      type="body2"
      color="primary"
      numberOfLines={1}
      center="true"
      style={styles.emptyStyle}>
      {t('transactions.empty')}
    </GlobalText>
  );

  return (
    <>
      <View style={styles.titleStyle}>
        <GlobalPadding />
        <Header activeWallet={activeWallet} config={config} t={t} />
        {/* MI, vanilla title layout */}
        {/* <GlobalBackTitle title={t('transactions.your_transactions')} /> */}
        <View style={globalStyles.centered}>
          <GlobalText type="headline2">
            {t(`transactions.your_transactions`)}
          </GlobalText>
        </View>
      </View>
      <GlobalLayout>
        <GlobalLayout.Header>
          <View>
            {loaded && recentTransactions?.length ? (
              recentTransactions?.map((transaction, i) => {
                switch (transaction.type) {
                  case TRANSACTION_TYPE.TRANSFER:
                  case TRANSACTION_TYPE.TRANSFER_CHECKED:
                    const isReceive = transaction.transferType === 'received';
                    const isUnknown = !transaction.destination;
                    const isCreate = isUnknown && !transaction.amount;
                    return (
                      <>
                        <GlobalText
                          key={`gt-${transaction.signature}`}
                          type="body2"
                          color="secondary"
                          style={
                            i === 0 ? styles.dateStyleFirst : styles.dateStyle
                          }>
                          {showDate(recentTransactions, i)}
                        </GlobalText>
                        <CardButtonTransaction
                          key={transaction.signature}
                          transaction={
                            isUnknown
                              ? 'unknown'
                              : isReceive
                              ? 'received'
                              : 'sent'
                          }
                          tokenImg1={
                            transaction.transferLogoIn ||
                            transaction.transferLogoOut ||
                            transaction.transferTokenLogo ||
                            transaction.tokenLogoIn ||
                            transaction.tokenLogoOut ||
                            (!transaction.error && MLN_ICON)
                          }
                          title={isCreate && TYPES_MAP[transaction.type]}
                          address={
                            isReceive
                              ? transaction.source
                              : transaction.destination
                          }
                          // percentage="+0000%"
                          actions={
                            transaction.error
                              ? [
                                  <View style={styles.inline}>
                                    {!isReceive && (
                                      <GlobalText
                                        key={'amount-action'}
                                        type="body2"
                                        color="negativeLight">
                                        {`${'-'}${
                                          transaction.fee /
                                          TOKEN_DECIMALS.MIRALAND
                                        } MLN  `}
                                      </GlobalText>
                                    )}
                                    <GlobalImage
                                      source={IconFailed}
                                      size="xxs"
                                    />
                                  </View>,
                                ]
                              : transaction.nftAmount
                              ? [
                                  transaction.type !== 'create' && (
                                    <View style={styles.inline}>
                                      <GlobalText
                                        key={'amount-action'}
                                        type="body1"
                                        color={
                                          isReceive
                                            ? 'positive'
                                            : 'negativeLight'
                                        }>
                                        {isReceive ? '+ 1 ' : '- 1 '}
                                        {`${transaction.nftAmount?.collection?.name} `}
                                      </GlobalText>
                                    </View>
                                  ),
                                ]
                              : (transaction.transferNameIn?.length ||
                                  transaction.transferNameOut?.length) &&
                                transaction.transferAmount
                              ? [
                                  <View style={styles.inline}>
                                    <GlobalText
                                      key={'amount-action'}
                                      type="body1"
                                      color={
                                        isReceive ? 'positive' : 'negativeLight'
                                      }>
                                      {isReceive ? '+' : '-'}
                                      {`${parseFloat(
                                        transaction.transferAmount.toFixed(4),
                                      )} `}
                                      {`${
                                        transaction.transferNameIn ||
                                        transaction.transferNameOut
                                      } `}
                                    </GlobalText>
                                  </View>,
                                ]
                              : [
                                  <View style={styles.inline}>
                                    {(transaction.amount ||
                                      transaction.transferAmount) && (
                                      <GlobalText
                                        key={'amount-action'}
                                        type="body1"
                                        color={
                                          isReceive
                                            ? 'positive'
                                            : 'negativeLight'
                                        }>
                                        {isReceive ? '+' : '-'}
                                        {transaction.amount ||
                                          transaction.transferAmount}
                                        {` ${transaction.transferTokenSymbol}  `}
                                      </GlobalText>
                                    )}
                                  </View>,
                                ].filter(Boolean)
                          }
                          onPress={() => onDetail(i)}
                        />
                      </>
                    );
                  case TRANSACTION_TYPE.SWAP:
                    return (
                      <>
                        <GlobalText
                          key={`gt-${transaction.signature}`}
                          type="body2"
                          color="secondary"
                          style={
                            i === 0 ? styles.dateStyleFirst : styles.dateStyle
                          }>
                          {showDate(recentTransactions, i)}
                        </GlobalText>
                        <CardButtonTransaction
                          key={transaction.signature}
                          transaction="swap"
                          tokenImg1={
                            !transaction.error && transaction.tokenLogoIn
                          }
                          tokenImg2={
                            !transaction.error && transaction.tokenLogoOut
                          }
                          tokenNames={
                            // !transaction.error &&
                            // transaction.tokenNameIn &&
                            // transaction.tokenNameOut
                            !transaction.error
                              ? `${
                                  transaction.tokenNameIn
                                    ? transaction.tokenNameIn
                                    : 'Unknown'
                                } → ${
                                  transaction.tokenNameOut
                                    ? transaction.tokenNameOut
                                    : 'Unknown'
                                }
                                `
                              : 'Unknown'
                          }
                          // percentage="+0000%"
                          actions={
                            transaction.error
                              ? [
                                  <View style={styles.inline}>
                                    <GlobalText
                                      key={'amount-action'}
                                      type="body1"
                                      color="negativeLight">
                                      {`${'-'}${
                                        transaction.fee /
                                        TOKEN_DECIMALS.MIRALAND
                                      } MLN  `}
                                    </GlobalText>
                                    <GlobalImage
                                      source={IconFailed}
                                      size="xxs"
                                    />
                                  </View>,
                                ]
                              : transaction.swapAmountIn !== '0' &&
                                [
                                  <View style={styles.inline}>
                                    <GlobalText
                                      key={'amount-action'}
                                      type="body1"
                                      color="positive">
                                      {`+${
                                        transaction.swapAmountIn /
                                        (transaction.tokenNameIn === 'MLN' ||
                                        !transaction.tokenNameIn
                                          ? TOKEN_DECIMALS.MIRALAND
                                          : TOKEN_DECIMALS.COINS)
                                      } ${transaction.tokenNameIn || 'MLN'} `}
                                    </GlobalText>
                                  </View>,
                                  <View style={styles.inline}>
                                    {transaction.swapAmountOut && (
                                      <>
                                        <GlobalText
                                          key={'amount-action'}
                                          type="body1"
                                          color="negativeLight">
                                          {`-${
                                            transaction.swapAmountOut /
                                            (transaction.tokenNameOut ===
                                              'MLN' || !transaction.tokenNameOut
                                              ? TOKEN_DECIMALS.MIRALAND
                                              : TOKEN_DECIMALS.COINS)
                                          } ${
                                            transaction.tokenNameOut || 'MLN'
                                          } `}
                                        </GlobalText>
                                      </>
                                    )}
                                  </View>,
                                ].filter(Boolean)
                          }
                          onPress={() => onDetail(i)}
                        />
                      </>
                    );
                  case TRANSACTION_TYPE.GET_ACC_DATA:
                  case TRANSACTION_TYPE.CREATE_ACCOUNT:
                  case TRANSACTION_TYPE.CREATE:
                  case TRANSACTION_TYPE.CLOSE_ACCOUNT:
                    return (
                      <>
                        <GlobalText
                          key={`gt-${transaction.signature}`}
                          type="body2"
                          color="secondary"
                          style={
                            i === 0 ? styles.dateStyleFirst : styles.dateStyle
                          }>
                          {showDate(recentTransactions, i)}
                        </GlobalText>
                        <CardButtonTransaction
                          key={transaction.signature}
                          transaction="interaction"
                          title={TYPES_MAP[transaction.type]}
                          actions={
                            transaction.error
                              ? [
                                  <View style={styles.inline}>
                                    <GlobalImage
                                      source={IconFailed}
                                      size="xxs"
                                    />
                                  </View>,
                                ]
                              : [
                                  <View style={styles.inline}>
                                    <GlobalImage
                                      source={IconSuccess}
                                      size="xxs"
                                    />
                                  </View>,
                                ].filter(Boolean)
                          }
                          onPress={() => onDetail(i)}
                        />
                      </>
                    );
                }
              })
            ) : recentTransactions?.length === 0 ? (
              <Empty />
            ) : (
              <GlobalSkeleton type="ActivityList" />
            )}
            {loading && <GlobalSkeleton type="ActivityList" />}
            {/*
            <CardButtonTransaction
              signature={transaction.signature}
              transaction="paid"
              address="AXNAwy7iq6bTthgtojjuUVqA279KhUmppdAbzYSfH18S"
              amount="+5 MLN"
              percentage="+0000%"
              onPress={() => onDetail(1)}
            /> */}
            {showLoadMore() ? (
              <GlobalButton
                type="text"
                title={t('transactions.load_more')}
                onPress={onLoadMore}
              />
            ) : null}
          </View>
        </GlobalLayout.Header>
      </GlobalLayout>
    </>
  );
};

export default withTranslation()(TransactionsListPage);
