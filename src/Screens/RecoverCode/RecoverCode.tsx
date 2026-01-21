import React, {useState} from 'react';
import {Dimensions, Image, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import ResponsiveImage from 'react-native-responsive-image';
import {useSelector} from 'react-redux';
import {FormCode} from '../../Components/Login/FormCode';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

export const RecoverCode: React.FC = (props: any): JSX.Element => {
  const [withCode, setWithCode] = useState<any>(
    props.route.params?.haveCode || false,
  );
  const [cellPhone, setCellPhone] = useState<any>(
    props.route.params?.cellPhone || false,
  );
  const generalConfigurations = useSelector(
    (store: ISTore) => store.generalConfigurations,
  );

  return (
    <LinearGradient
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
      colors={['#FFFFFF', '#CCCCCC', '#B3B3B3']}>
      <KeyboardAwareScrollView style={{flex: 1}}>
        <View style={{flex: 1, alignItems: 'center', marginTop: 50}}>
          <ResponsiveImage
            initHeight={height / 4}
            initWidth={width * 0.9}
            resizeMode="contain"
            source={{
              uri:
                generalConfigurations.imageUrl ===
                'https://activagas-files.s3.amazonaws.com/initialimage.png'
                  ? 'https://activagas-files.s3.amazonaws.com/activawithout.png'
                  : generalConfigurations.imageUrl,
            }} />

          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 50,
            }}>
            <Text style={{color: '#1F97DC', fontSize: 23, fontWeight: '100'}}>
              INGRESAR CODIGO RECIBIDO EN WHATSAPP
            </Text>
          </View>
          {!withCode ? (
            <FormCode cellPhone={cellPhone} />
          ) : (
            <FormCode withCode />
          )}
        </View>
        <View style={{width, alignItems: 'flex-end'}}>
          <View
            style={{
              width: width,
              height: 200,
              aspectRatio: 1 * 1.4,
            }}>
            <Image
              source={{
                uri: 'https://activagas-files.s3.amazonaws.com/backcar2.png',
              }}
              style={{
                resizeMode: 'contain',
                width: '100%',
                height: '100%',
              }}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};
