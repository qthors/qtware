import React, { useContext, useEffect, useState } from 'react';
// import { StyleSheet, View } from 'react-native';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { ROUTES_MAP } from './routes';
import { cache, CACHE_TYPES } from '../../utils/cache';
import { withTranslation } from '../../hooks/useTranslations';

import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalNftList from '../../component-library/Global/GlobalNftList';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';
import Header from '../../component-library/Layout/Header';
import useAnalyticsEventTracker from '../../hooks/useAnalyticsEventTracker';
import { SECTIONS_MAP } from '../../utils/tracking';

const NftsCollectionPage = ({ params, t }) => {
  useAnalyticsEventTracker(SECTIONS_MAP.NFT_COLLECTION);
  const navigate = useNavigation();
  const [loaded, setLoaded] = useState(false);
  const [nftsCollection, setNftsCollection] = useState([]);
  const [listedInfo, setListedInfo] = useState([]);
  const [{ activeWallet, config }] = useContext(AppContext);
  useEffect(() => {
    if (activeWallet) {
      cache(
        `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
        CACHE_TYPES.NFTS,
        // MI, simplify
        () => activeWallet.getAllNftsGrouped(),
        // () => activeWallet.getAllNfts(),
      ).then(async nfts => {
        const collection = nfts.find(n => n.collection === params.id);
        if (collection) {
          setNftsCollection(collection.items);
        }
        const listed = await activeWallet.getListedNfts();
        setListedInfo(listed);
        setLoaded(true);
      });
    }
  }, [activeWallet, params.id]);
  const goToBack = () => {
    navigate(ROUTES_MAP.NFTS_LIST);
  };
  const onClick = nft => {
    // MI, vanilla
    // navigate(ROUTES_MAP.NFTS_DETAIL, { id: nft.mint });
    navigate(ROUTES_MAP.NFTS_DETAIL, {
      id: nft?.mint?.address || nft?.address,
    });
  };
  return (
    (loaded && (
      <GlobalLayout fullscreen>
        <GlobalLayout.Header>
          <GlobalPadding />
          <Header activeWallet={activeWallet} config={config} t={t} />
          <GlobalBackTitle
            onBack={goToBack}
            inlineTitle={
              <GlobalText type="headline2" center>
                {/* {params.id} */}
                {[
                  nftsCollection?.[0].symbol,
                  '(',
                  params.id.substring(0, 3),
                  '...',
                  params.id.substring(params.id.length - 3),
                  ')',
                ].join('')}
              </GlobalText>
            }
          />
          <GlobalNftList
            nonFungibleTokens={nftsCollection}
            listedInfo={listedInfo}
            onClick={onClick}
          />
        </GlobalLayout.Header>
      </GlobalLayout>
    )) ||
    null
  );
};

export default withParams(withTranslation()(NftsCollectionPage));
