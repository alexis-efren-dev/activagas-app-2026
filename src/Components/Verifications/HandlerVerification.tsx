import React from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Button, Card, Title } from 'react-native-paper';
import ResponsiveImage from 'react-native-responsive-image';
import { useMutationUpdateNextVerification } from '../../services/Verification/useMutationUpdateNextVerification';
import customStyles from '../Styles/ActivatorScreens/DashboardRegister/styles';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
interface IProps {
  data: any;
  request: any;
  navigation: any;
}
const HandlerVerification: React.FC<IProps> = ({data, request, navigation}) => {
  const {mutate,isPending:isLoading} = useMutationUpdateNextVerification();

  return (
    <LinearGradient
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
      colors={['#074169', '#019CDE', '#ffffff']}>
      <View style={{marginTop: 30}}>
        <ResponsiveImage
          initHeight={height / 5}
          initWidth={width * 0.4}
          resizeMode="contain"
          source={{
            uri: 'https://activagas-files.s3.amazonaws.com/registerInitialIcon.png',
          }} />
      </View>
      <View
        style={{
          width: width / 2.5,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: '#ffffff', fontSize: 23, fontWeight: 'bold'}}>
          VERIFICAR
        </Text>
      </View>
      <ScrollView style={{flex: 2}}>
        <View style={{flex: 1}}>
          <Card.Content>
            {data.expired ? (
              <Title style={{color: 'white'}}>
                Este equipo debio haber sido verificado antes del dia{' '}
                {data.date} hacer verificacion lo antes posible
              </Title>
            ) : (
              <Title style={{color: 'white'}}>
                Este equipo debera ser verificado antes del dia {data.date},
                puedes hacer la verificacion en estos momentos
              </Title>
            )}
            <Title style={{color: 'white'}}>
              Da click en el boton para verificar
            </Title>
          </Card.Content>
          <Card.Actions style={customStyles.card}>
            <Button
              disabled={isLoading}
              loading={isLoading}
              mode="contained"
              buttonColor="#1C9ADD"
              onPress={() =>
                mutate({
                  _id: request._id,
                  idGas: request.idGas,
                  condition: '1',
                })
              }>
              1 año
            </Button>
          </Card.Actions>
          <Button
            style={{marginTop: 50}}
            mode="contained"
            buttonColor="#1C9ADD"
            onPress={() => {
              navigation.navigate('Dashboard');
            }}>
            Terminar
          </Button>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};
export default HandlerVerification;
