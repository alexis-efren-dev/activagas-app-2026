import React from 'react';
import {Image, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {TouchableRipple} from 'react-native-paper';
interface CardButtonProps {
  customStylesContainer: any;
  imageUrl: string;
  customStylesImage: any;
  colorsGradient: any;
  label: string;
  customStylesLabel: any;
  onHandleClick: any;
}
const CardButton: React.FC<CardButtonProps> = ({
  customStylesContainer,
  imageUrl,
  customStylesImage,
  colorsGradient,
  label,
  customStylesLabel,
  onHandleClick,
}) => {
  return (
    <TouchableRipple onPress={onHandleClick}>
      <LinearGradient style={customStylesContainer} colors={colorsGradient}>
        <View
          style={{
            width: customStylesImage.width,
            height: customStylesImage.height,
            aspectRatio: 1 * 1.4,
          }}>
          <Image
            source={{
              uri: imageUrl,
            }}
            style={{
              resizeMode: 'contain',
              width: '100%',
              height: '100%',
            }}
          />
        </View>
        <Text style={customStylesLabel}>{label}</Text>
      </LinearGradient>
    </TouchableRipple>
  );
};

export default CardButton;
