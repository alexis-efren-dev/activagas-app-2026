import {StackNavigationProp} from '@react-navigation/stack';
import {Dimensions, ScrollView, Text, View, StyleSheet} from 'react-native';
import ResponsiveImage from 'react-native-responsive-image';
import LinearGradient from 'react-native-linear-gradient';
import {Button, Paragraph} from 'react-native-paper';
import {useSelector} from 'react-redux';
import dataFormRegisterPay from '../../DataForms/dataFormRegisterPay.json';
import {IStore} from '../../redux/store';
import {useMutationRegisterPay} from '../../services/Clients/useMutationRegisterPay';
import {DynamicForm} from '../DynamicForms/DynamicForm';
import { useEffect, useState } from 'react';

const {width, height} = Dimensions.get('screen');

interface IUser {
  user: any;
  navigation: StackNavigationProp<any, any>;
}

const FinalPay: React.FC<IUser> = ({user, navigation}) => {
  const userRedux = useSelector((store: IStore) => store.loggedUser);
  const [parsedForm, setParsedForm] = useState<any>(false);
  const {mutate, isPending: isLoading} = useMutationRegisterPay();

  const buttonInfo = {
    style: styles.buttonStyle,
    contentStyle: styles.buttonContent,
    buttonColor: '#1C9ADD',
    mode: 'contained',
  };

  const handleSubmit = (dataFields: any) => {
    mutate({
      idGas: userRedux.idGas,
      idAccounting: userRedux._id,
      idClient: user.infoData._id,
      pay: dataFields.pay,
      dateToPay: user.paymentData.nextDatePayment,
    });
    dataFields.pay = '';
  };

  useEffect(() => {
    if (user?.paymentData) {
      if (user.paymentData.isPaymentInitiated) {
        dataFormRegisterPay[0].value = String(
          Number(user.paymentData.automaticPayment) -
            Number(user.paymentData.amountPaid),
        );
      } else {
        dataFormRegisterPay[0].value = user.paymentData.automaticPayment;
      }

      setParsedForm(dataFormRegisterPay);
    }
  }, [user]);

  return (
    <ScrollView style={styles.container}>
      <LinearGradient style={styles.gradientContainer} colors={['#074169', '#019CDE', '#ffffff']}>
        <View style={styles.imageContainer}>
          <ResponsiveImage
            initHeight={height / 5}
            initWidth={width * 0.4}
            resizeMode="contain"
            source={{
              uri: 'https://activagas-files.s3.amazonaws.com/userinformation.png',
            }}
          />
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>REGISTRAR PAGO</Text>
        </View>

        <View style={styles.contentContainer}>
          <Paragraph style={styles.descriptionText}>
            {user.paymentData.isObligatory
              ? `La fecha de pago fue el dia ${user.paymentData.parsedData} por tanto al ingresar este pago, la siguiente fecha de pago sería exactamente en un mes contando a partir de la fecha ya mencionada`
              : `La fecha de pago es hasta el día ${user.paymentData.parsedData} por tanto al ingresar este pago, la siguiente fecha de pago sería exactamente en un mes contando a partir de la fecha ya mencionada`}
          </Paragraph>

          {user.paymentData.isPaymentInitiated ? (
            <Paragraph style={styles.warningText}>
              {`De esta fecha de pago se han pagado ${user.paymentData.amountPaid}$ de los ${user.paymentData.automaticPayment}$ cobrados en cada pago, restarían ${
                Number(user.paymentData.automaticPayment) - Number(user.paymentData.amountPaid)
              } para completar el pago, se le otorgaron ${user.paymentData.approvedDays} días de activación temporales`}
            </Paragraph>
          ) : null}

          {parsedForm ? (
            <DynamicForm
              isInitialDisabled={false}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              json={parsedForm}
              labelSubmit="Registrar Pago"
              buttonProps={buttonInfo}
            />
          ) : null}

          <Button
            style={styles.finishButton}
            mode="contained"
            buttonColor="#1C9ADD"
            onPress={() => {
              navigation.navigate('Dashboard', {
                refresh: true,
              });
            }}>
            Terminar
          </Button>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  gradientContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    marginTop: 30,
  },
  titleContainer: {
    flex: 1,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    color: '#ffffff',
    fontSize: 23,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 3,
    alignItems: 'center',
  },
  descriptionText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
    padding: 5,
    textAlign: 'center',
  },
  warningText: {
    color: 'red',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  buttonStyle: {
    width: width / 2,
    marginTop: 10,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  finishButton: {
    marginTop: 10,
    width: width / 2,
  },
});

export default FinalPay;
