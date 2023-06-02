import React, { useContext, useEffect, useState } from 'react';
import {
  MIRA,
  MIRALAND,
  QTHOR,
  SOLARTI,
} from 'qtw-wallet-adapter/constants/chains';
import { AppContext } from '../../AppProvider';
import AdapterSelect from './components/AdapterSelect';
import AdapterDetail from './components/AdapterDetail';

const AdapterPage = () => {
  const [{ activeWallet }] = useContext(AppContext);
  const [step, setStep] = useState(
    activeWallet?.getChain() === MIRALAND ||
      activeWallet?.getChain() === SOLARTI ||
      activeWallet?.getChain() === QTHOR ||
      activeWallet?.getChain() === MIRA
      ? 2
      : 1,
  );

  useEffect(() => {
    if (
      activeWallet?.getChain() === MIRALAND ||
      activeWallet?.getChain() === SOLARTI ||
      activeWallet?.getChain() === QTHOR ||
      activeWallet?.getChain() === MIRA
    ) {
      setStep(2);
    }
  }, [activeWallet]);

  return (
    <>
      {step === 1 && <AdapterSelect onSelected={() => setStep(2)} />}
      {step === 2 && <AdapterDetail />}
    </>
  );
};

export default AdapterPage;
