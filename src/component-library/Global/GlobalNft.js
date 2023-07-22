import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';

import { withTranslation } from '../../hooks/useTranslations';
import theme from './theme';
import GlobalImage from './GlobalImage';
import GlobalText from './GlobalText';
import GlobalFloatingBadge from './GlobalFloatingBadge';

import { getMediaRemoteUrl } from '../../utils/media';
import { isCollection, isBlacklisted } from '../../utils/nfts';
import Blacklisted from '../../assets/images/Blacklisted.jpeg';
import IconSolana from '../../assets/images/IconSolana.png';
import IconHyperspace from '../../assets/images/IconHyperspace.jpeg';

const styles = StyleSheet.create({
  image: {
    aspectRatio: 1,
    backgroundColor: theme.colors.bgLight,
    borderRadius: theme.borderRadius.borderRadiusXL,
    overflow: 'hidden',
    zIndex: 1,
  },
  touchable: {
    width: '100%',
    flexGrow: 1,
  },
  nameContainer: {
    backgroundColor: theme.colors.bgDarken,
    borderRadius: theme.borderRadius.borderRadiusXL,
    marginBottom: theme.gutters.paddingXXS,
    marginTop: -36,
    height: '70px',
    zIndex: -1,
  },
  nftName: {
    paddingTop: theme.gutters.padding2XL + 6,
    paddingRight: 15,
    paddingLeft: 15,
  },
  hsIcon: {
    marginBottom: -3,
    marginLeft: 4,
  },
  solanaIcon: {
    marginBottom: -3,
    marginLeft: 6,
  },
});

// MI: change <View key={nft.url} style={styles.image}> to <View key={nft.uri} style={styles.image}>
const GlobalNft = ({ nft, onClick = () => {}, t }) => (
  <>
    <TouchableOpacity onPress={() => onClick(nft)} style={styles.touchable}>
      <View key={nft.uri} style={styles.image}>
        <GlobalFloatingBadge
          {...{
            titleTop: nft.marketInfo?.price && (
              <>
                <Text>{t('nft.listed_nft')}</Text>
                <GlobalImage
                  source={IconHyperspace}
                  circle
                  size="xxs"
                  style={styles.hsIcon}
                />
              </>
            ),
          }}
        />
        <GlobalImage
          source={
            isBlacklisted(nft)
              ? Blacklisted
              : getMediaRemoteUrl(
                  isCollection(nft) ? nft.thumb : nft.json.image,
                )
          }
          size="block"
        />
        <GlobalFloatingBadge
          {...(isCollection(nft) && nft.length > 1
            ? { number: nft.length }
            : {
                title: nft.marketInfo?.price && (
                  <>
                    <Text>{nft.marketInfo?.price}</Text>
                    <GlobalImage
                      source={IconSolana}
                      circle
                      size="xxs"
                      // eslint-disable-next-line react-native/no-inline-styles
                      style={{ marginBottom: -3, marginLeft: 6 }}
                    />
                  </>
                ),
              })}
        />
      </View>
    </TouchableOpacity>
    <View style={styles.nameContainer}>
      <GlobalText
        style={styles.nftName}
        center
        type="caption"
        numberOfLines={1}>
        {isCollection(nft)
          ? [
              nft.symbol,
              '(',
              nft.collection.substring(0, 3),
              '...',
              nft.collection.substring(nft.collection.length - 3),
              ')',
            ].join('')
          : nft.name || nft.symbol}
      </GlobalText>
    </View>
  </>
);
export default withTranslation()(GlobalNft);
