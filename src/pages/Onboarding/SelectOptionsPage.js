import React, { useContext, useState } from 'react';
import { StyleSheet, Linking, View } from 'react-native';

import { useNavigation } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';
import { getChains, getDefaultChain, LOGOS } from '../../utils/wallet';
import { ROUTES_MAP as ROUTES_MAP_APP } from '../../routes/app-routes';
import { ROUTES_MAP } from './routes';
import theme from '../../component-library/Global/theme';

import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalButton from '../../component-library/Global/GlobalButton';
import CardButton from '../../component-library/CardButton/CardButton';
import SimpleDialog from '../../component-library/Dialog/SimpleDialog';

import AvatarImage from '../../component-library/Image/AvatarImage';

import AppIcon from '../../assets/images/AppIcon.png';
import AppTitle from '../../assets/images/AppTitle.png';
import { AppContext } from '../../AppProvider';

import useAnalyticsEventTracker from '../../hooks/useAnalyticsEventTracker';
import { SECTIONS_MAP, EVENTS_MAP } from '../../utils/tracking';

const styles = StyleSheet.create({
  appIconImage: {
    marginBottom: 30,
    width: 88,
    height: 88,
  },
  appTitleImage: {
    width: 124,
    height: 26,
  },
  appLogo: {
    width: 88,
    height: 88,
    margin: 'auto',
  },
  touchable: {
    maxWidth: theme.variables.buttonMaxWidth,
  },
  disabledAvatar: {
    backgroundColor: '#999',
    opacity: 0.5,
    borderRadius: 50,
  },
});

const SelectAction = ({ onNext, onBack, onboarded, t }) => {
  // const { trackEvent } = useAnalyticsEventTracker(
  //   SECTIONS_MAP.SELECT_CREATE_RECOVER,
  // );
  return (
    <>
      <GlobalLayout.Header>
        <GlobalBackTitle
          onBack={onBack}
          secondaryTitle={
            onboarded
              ? t('wallet.onboarding.titleOnboarded')
              : t('wallet.onboarding.titleWelcome')
          }
        />
      </GlobalLayout.Header>

      <GlobalLayout.Inner>
        <GlobalImage source={AppIcon} style={styles.appIconImage} />
        <GlobalImage source={AppTitle} style={styles.appTitleImage} />
      </GlobalLayout.Inner>

      <GlobalLayout.Footer>
        <GlobalButton
          type="primary"
          wide
          title={t('wallet.create_wallet')}
          onPress={() => onNext(ROUTES_MAP.ONBOARDING_CREATE)}
          // disabled={!chainCode}
        />

        <GlobalPadding size="md" />

        <GlobalButton
          type="secondary"
          wide
          title={t('wallet.recover_wallet')}
          onPress={() => onNext(ROUTES_MAP.ONBOARDING_RECOVER)}
          // disabled={!chainCode}
        />
      </GlobalLayout.Footer>
    </>
  );
};

const ComingSoon = ({ currentChain, comingSoon, setComingSoon, t }) => {
  const goToTwitter = () => Linking.openURL(`https://twitter.com/miracleland6`);
  const onClose = () => setComingSoon(false);

  return (
    <SimpleDialog
      title={
        <GlobalText center type="headline3" numberOfLines={1}>
          {`${currentChain} ${t('wallet.is_coming_soon')}`}
        </GlobalText>
      }
      btn1Title={t('actions.follow_us')}
      btn2Title={t('actions.continue')}
      onClose={onClose}
      isOpen={comingSoon}
      action={goToTwitter}
      text={
        <GlobalText
          center
          onPress={goToTwitter}
          type="subtitle1"
          numberOfLines={1}>
          Stay tuned
        </GlobalText>
      }
    />
  );
};

const SelectChain = ({ onNext, blockChains, onBack, t, onComingSoon }) => (
  <GlobalLayout.Header>
    <GlobalBackTitle
      onBack={onBack}
      secondaryTitle={t('wallet.onboarding.select_blockchain')}
    />

    <GlobalPadding size="md" />

    <GlobalText type="body1" center>
      {t('wallet.onboarding.select_blockchain_text')}
    </GlobalText>

    <GlobalPadding size="md" />

    {blockChains.map(chain => (
      <CardButton
        key={chain}
        onPress={() => onNext(chain)}
        icon={<AvatarImage url={LOGOS[chain]} size={48} />}
        // title={chain}
        title={t(`wallet.onboarding.blockchain.${chain}`)}
        touchableStyles={styles.touchable}
      />
    ))}
    {/* <CardButton
      key={'NEAR'}
      onPress={() => onComingSoon('NEAR')}
      icon={
        <View style={styles.disabledAvatar}>
          <AvatarImage url={LOGOS.NEAR} size={48} />
        </View>
      }
      title={'NEAR'}
      description={'coming soon'}
      touchableStyles={styles.touchable}
    /> */}
    <CardButton
      key={'SOLANA'}
      onPress={() => onComingSoon('SOLANA')}
      icon={
        <View style={styles.disabledAvatar}>
          <AvatarImage url={LOGOS.SOLANA} size={48} />
        </View>
      }
      title={'SOLANA'}
      description={'Coming soon'}
      touchableStyles={styles.touchable}
    />
    <CardButton
      key={'ETHEREUM'}
      onPress={() => onComingSoon('ETHEREUM')}
      icon={
        <View style={styles.disabledAvatar}>
          <AvatarImage url={LOGOS.ETHEREUM} size={48} />
        </View>
      }
      title={'ETHEREUM'}
      description={'Coming soon'}
      touchableStyles={styles.touchable}
    />
  </GlobalLayout.Header>
);

const SelectOptionsPage = ({ t }) => {
  const { trackEvent } = useAnalyticsEventTracker(SECTIONS_MAP.SELECT_CHAIN);
  const navigate = useNavigation();
  const [{ wallets }] = useContext(AppContext);
  const [actionRoute, setActionRoute] = useState();
  const [step, setStep] = useState(0);
  const [comingSoon, setComingSoon] = useState(false);
  const [currentChain, setCurrentChain] = useState(null);
  const onSelectAction = action => {
    setActionRoute(action);
    // m17: vanilla step 1 is to choose chain, skip to choose default chain directly
    // add step 2 for direct miraland navigation purpose
    // setStep(1);
    setStep(2);
  };
  const onSelectChain = chain => {
    trackEvent(EVENTS_MAP.SELECT_CHAIN, chain);
    navigate(actionRoute, { chainCode: chain });
  };
  const onComingSoon = chain => {
    setCurrentChain(chain);
    setComingSoon(true);
  };
  const onHomeBack = () => {
    if (wallets.length) {
      navigate(ROUTES_MAP_APP.WALLET);
    } else {
      navigate(ROUTES_MAP_APP.WELCOME);
    }
  };
  return (
    <GlobalLayout fullscreen>
      {step === 0 && (
        <SelectAction
          onNext={onSelectAction}
          onBack={onHomeBack}
          onboarded={wallets.length}
          t={t}
        />
      )}
      {step === 1 && (
        <>
          <SelectChain
            onNext={onSelectChain}
            blockChains={getChains()}
            onBack={() => setStep(0)}
            onComingSoon={onComingSoon}
            t={t}
          />
          <ComingSoon
            currentChain={currentChain}
            comingSoon={comingSoon}
            setComingSoon={setComingSoon}
            t={t}
          />
        </>
      )}
      {/* m17 added step 2 */}
      {step === 2 && onSelectChain(getDefaultChain())}
    </GlobalLayout>
  );
};

export default withTranslation()(SelectOptionsPage);
