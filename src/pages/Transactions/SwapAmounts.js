import React from 'react';
import { TOKEN_DECIMALS } from './constants';
import GlobalText from '../../component-library/Global/GlobalText';

const SwapAmounts = ({ inAmount, outAmount, inToken, outToken }) => {
  return (
    <>
      <GlobalText type="headline3" center>
        {inAmount &&
          `-${
            inAmount /
            (inToken === 'MLN' || !inToken
              ? TOKEN_DECIMALS.MIRALAND
              : TOKEN_DECIMALS.COINS)
          } ${inToken || 'MLN'} `}
      </GlobalText>
      <GlobalText type="headline3" center>
        {outAmount &&
          `+${
            outAmount /
            (outToken === 'MLN' || !outToken
              ? TOKEN_DECIMALS.MIRALAND
              : TOKEN_DECIMALS.COINS)
          } ${outToken || 'MLN'} `}
      </GlobalText>
    </>
  );
};

export default SwapAmounts;
