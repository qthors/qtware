import React from 'react';
import get from 'lodash/get';
import CardButton from '../../component-library/CardButton/CardButton';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalSkeleton from '../../component-library/Global/GlobalSkeleton';
import AvatarImage from '../../component-library/Image/AvatarImage';
import { withTranslation } from '../../hooks/useTranslations';
import {
  hiddenValue,
  showAmount,
  showPercentage,
  getLabelValue,
} from '../../utils/amount';

const TokenList = ({ tokens, onDetail, hiddenBalance, t }) => (
  <>
    {tokens ? (
      <List
        tokens={tokens}
        onDetail={onDetail}
        hiddenBalance={hiddenBalance}
        t={t}
      />
    ) : (
      <GlobalSkeleton type="TokenList" />
    )}
  </>
);

const List = ({ tokens, onDetail, hiddenBalance, t }) => (
  <>
    {tokens.map(tok => (
      <CardButton
        key={tok.mint}
        onPress={() => onDetail(tok)}
        icon={<AvatarImage url={tok.logo} size={48} />}
        // title={tok.name} // MI, vanilla
        title={
          t(`token_symbol_names.${tok.symbol}`) ===
          `token_symbol_names.${tok.symbol}`
            ? tok.name
            : t(`token_symbol_names.${tok.symbol}`)
        } // MI
        description={`${hiddenBalance ? hiddenValue : tok.uiAmount} ${
          tok.symbol || ''
        }`}
        actions={[
          <GlobalText key={'amount-action'} type="body2">
            {hiddenBalance ? hiddenValue : showAmount(tok.indexBalance)}
          </GlobalText>,
          tok.last24HoursChange && (
            <GlobalText
              key={'perc-action'}
              type="body2"
              color={getLabelValue(get(tok, 'last24HoursChange.perc'))}>
              {showPercentage(get(tok, 'last24HoursChange.perc'))}
            </GlobalText>
          ),
        ].filter(Boolean)}
      />
    ))}
  </>
);

export default withTranslation()(TokenList);
