import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import get from 'lodash/get';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { ROUTES_MAP } from './routes';
import { withTranslation } from '../../hooks/useTranslations';
import { cache, CACHE_TYPES } from '../../utils/cache';
// import { getWalletName } from '../../utils/wallet';
import { getMediaRemoteUrl } from '../../utils/media';

import theme, { globalStyles } from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalFloatingBadge from '../../component-library/Global/GlobalFloatingBadge';
import CardButton from '../../component-library/CardButton/CardButton';
import Header from '../../component-library/Layout/Header';
import IconSolana from '../../assets/images/IconSolana.png';
import IconHyperspaceWhite from '../../assets/images/IconHyperspaceWhite.png';
import IconHyperspace from '../../assets/images/IconHyperspace.jpeg';

import useAnalyticsEventTracker from '../../hooks/useAnalyticsEventTracker';
import { SECTIONS_MAP } from '../../utils/tracking';

const styles = StyleSheet.create({
  renderItemStyle: {
    width: '49%',
    marginBottom: theme.gutters.paddingXS,
  },
  columnWrapperStyle: {
    flex: 1,
    justifyContent: 'space-between',
  },
  nftImage: {
    width: '80%',
    margin: 'auto',
  },
  imageContainer: {
    flexGrow: 1,
    width: '100%',
  },
  hyperspaceIcon: {
    marginBottom: -3,
    marginLeft: 4,
  },
  topPriceIcon: {
    marginBottom: -3,
    marginLeft: 2,
    position: 'absolute',
    right: 8,
  },
});

const NftsDetailPage = ({ params, t }) => {
  useAnalyticsEventTracker(SECTIONS_MAP.NFT_DETAIL);
  const navigate = useNavigation();
  const [{ activeWallet, config }] = useContext(AppContext);
  const [loaded, setLoaded] = useState(false);
  const [listedLoaded, setListedLoaded] = useState(false);
  const [nftDetail, setNftDetail] = useState({});
  const [listedInfo, setListedInfo] = useState([]);

  useEffect(() => {
    if (activeWallet) {
      cache(
        `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
        CACHE_TYPES.NFTS_ALL,
        () => activeWallet.getAllNfts(),
      ).then(async nfts => {
        const nft = nfts.find(
          // eslint-disable-next-line eqeqeq
          n => n.mint?.address === params.id || n.mint?.address == params.id,
        );
        if (nft) {
          console.log('setNftDetail with current nft: ', nft.mint.address);
          setNftDetail(nft);
        } else {
          console.log('No nft found matching params.id: ', params.id);
        }
        const listed = await activeWallet.getListedNfts();
        setListedInfo(listed.find(l => l.mint?.address === params.id));
        // mira: comment out vanilla true for now
        // setListedLoaded(true);
        setListedLoaded(false);
        setLoaded(true);
      });
    }
  }, [activeWallet, params.id]);

  const getListBtnTitle = () =>
    !listedLoaded ? (
      // 'coming soon...'
      t('nft.list_nft')
    ) : listedInfo ? (
      <>
        {t('nft.delist_nft')}
        {'  '}
        <GlobalImage
          source={IconHyperspaceWhite}
          size="xxs"
          style={{ marginBottom: -2 }}
        />
      </>
    ) : (
      <>
        {t('nft.list_nft')}
        {'  '}
        <GlobalImage
          source={IconHyperspaceWhite}
          size="xxs"
          style={{ marginBottom: -2 }}
        />
      </>
    );

  const hasProperties = () => {
    // return get(nftDetail, 'extras.attributes', []).length > 0;
    return get(nftDetail, 'json.attributes', []).length > 0;
  };

  const goToBack = () => {
    navigate(ROUTES_MAP.NFTS_LIST);
  };

  const goToSend = () => {
    navigate(ROUTES_MAP.NFTS_SEND, { id: params.id });
  };

  const goToListing = () => {
    navigate(ROUTES_MAP.NFTS_LISTING, {
      id: params.id,
      type: listedInfo ? 'unlist' : 'list',
    });
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.renderItemStyle}>
        <CardButton
          key={item.title}
          caption={item.caption}
          title={item.title}
          description={item.description}
          nospace
          readonly
        />
      </View>
    );
  };
  const title = nftDetail.name ? nftDetail.name : nftDetail.symbol;

  return (
    (loaded && (
      <GlobalLayout fullscreen>
        <GlobalLayout.Header>
          <Header activeWallet={activeWallet} config={config} t={t} />
          <GlobalBackTitle
            onBack={goToBack}
            inlineTitle={
              <GlobalText type="headline2" center>
                {title}
              </GlobalText>
            }
            nospace
          />

          <GlobalPadding size="xxs" />

          <View style={globalStyles.centered}>
            <GlobalPadding size="xs" />

            <View style={styles.imageContainer}>
              <GlobalImage
                source={getMediaRemoteUrl(nftDetail.json?.image)}
                style={styles.nftImage}
                square
                squircle
              />
              {listedInfo?.market_place_state?.price && (
                <GlobalFloatingBadge
                  {...{
                    titleTopDetail: (
                      <>
                        <Text>{t('nft.listed_nft')}</Text>
                        <GlobalImage
                          source={IconHyperspace}
                          circle
                          size="xxs"
                          style={styles.hyperspaceIcon}
                        />
                      </>
                    ),
                    titleTopPrice: (
                      <>
                        <Text>{listedInfo?.market_place_state?.price}</Text>
                        <GlobalImage
                          source={IconSolana}
                          circle
                          size="xxs"
                          style={styles.topPriceIcon}
                        />
                      </>
                    ),
                  }}
                />
              )}
            </View>

            <GlobalPadding size="lg" />

            <View style={globalStyles.inlineFlexButtons}>
              <GlobalButton
                type="primary"
                flex
                title={t('nft.send_nft')}
                onPress={goToSend}
                style={[globalStyles.button, globalStyles.buttonLeft]}
                touchableStyles={globalStyles.buttonTouchable}
              />

              <GlobalButton
                type="secondary"
                flex
                title={getListBtnTitle()}
                onPress={goToListing}
                disabled={!listedLoaded}
                style={[globalStyles.button, globalStyles.buttonRight]}
                touchableStyles={globalStyles.buttonTouchable}
              />
            </View>
            {/*
            <View style={globalStyles.inlineFlexAround}>
              <GlobalText type="overline" color="tertiary">
                Lorem ipsum
              </GlobalText>
              <GlobalText type="overline" color="tertiary">
                Lorem ipsum
              </GlobalText>
              <GlobalText type="overline" color="tertiary">
                Lorem ipsum
              </GlobalText>
              <GlobalText type="overline" color="tertiary">
                Lorem ipsum
              </GlobalText>
            </View>
            */}
          </View>

          <GlobalPadding size="lg" />

          <GlobalText type="body2">{t('nft.description')}</GlobalText>

          <GlobalPadding size="sm" />

          <GlobalText type="body1" color="secondary">
            {nftDetail.json?.description}
          </GlobalText>

          <GlobalPadding size="xl" />
          {hasProperties() && (
            <>
              <GlobalText type="body2">{t('nft.properties')}</GlobalText>

              <GlobalPadding size="sm" />

              <FlatList
                data={get(nftDetail, 'json.attributes', []).map(a => ({
                  caption: a.trait_type,
                  title: a.value,
                  description: '',
                }))}
                renderItem={renderItem}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapperStyle}
              />
            </>
          )}
        </GlobalLayout.Header>
      </GlobalLayout>
    )) ||
    null
  );
};

export default withParams(withTranslation()(NftsDetailPage));
