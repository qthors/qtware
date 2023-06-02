import React from 'react';
import { StyleSheet } from 'react-native';

import theme from '../Global/theme';
import CardButton from './CardButton';

import { getTransactionImage, getShortAddress } from '../../utils/wallet';

const styles = StyleSheet.create({
  imageStyle: {
    borderRadius: theme.borderRadius.borderRadiusPill,
  },
});

// signature, // m17 added
const CardButtonTransaction = ({
  transaction,
  address,
  tokenNames,
  // amount,
  percentage,
  title,
  description,
  active,
  complete,
  actionIcon,
  actions,
  onPress,
  touchableStyles,
  tokenImg1,
  tokenImg2,
  ...props
}) => {
  const getTransactionTitle = () => {
    const object = transaction;
    switch (object) {
      case 'sent':
        return 'Sent';
      case 'received':
        return 'Received';
      case 'swap':
        return 'Swap';
      case 'interaction':
        return 'Interaction';
      case 'paid':
        return 'Paid';
      case 'unknown':
        return 'Unknown';
      default:
        return 'Sent';
    }
  };

  // m17 key={signature}
  return (
    <CardButton
      image={getTransactionImage(transaction)}
      tokenImg1={tokenImg1}
      tokenImg2={tokenImg2}
      imageSize="normal"
      title={title || getTransactionTitle(transaction)}
      description={
        address
          ? `${transaction === 'sent' ? 'To:' : 'From:'} ${getShortAddress(
              address,
            )}`
          : tokenNames
      }
      active={active}
      complete={complete}
      actionIcon={actionIcon}
      imageStyle={styles.imageStyle}
      actions={actions}
      onPress={onPress}
      {...props}
    />
  );
};
export default CardButtonTransaction;
