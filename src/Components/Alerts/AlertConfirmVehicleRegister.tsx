import React from 'react';
import {Dimensions, View} from 'react-native';
import {Avatar, Button, Card, Modal, Portal, Title} from 'react-native-paper';
const {width} = Dimensions.get('screen');
interface IAlert {
  show: any;
  mutation: any;
  setShow: any;
}
const AlertConfirmVehicleRegister: React.FC<IAlert> = ({
  show,
  setShow,
  mutation,
}) => {
  const containerStyle = {
    backgroundColor: 'transparent',
    padding: width * 0.15,
  };
  const LeftContent = (props: any) => (
    <Avatar.Icon
      {...props}
      icon="thumb-up-outline"
      size={50}
      style={{backgroundColor: '#1C9ADD', top: -20}}
    />
  );
  return (
    <Portal>
      <Modal
        visible={show ? true : false}
        onDismiss={() => {
          setShow(false);
        }}
        contentContainerStyle={containerStyle}>
        <Card style={{width: width * 0.7}}>
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <LeftContent />
          </View>
          <Card.Content
            style={{justifyContent: 'center', alignItems: 'center'}}>
            <Title style={{fontSize: 15}}>
              {show.finalCredit != '0'
                ? `Se eligio pagar a ${
                    show.finalCredit
                  } semanas/meses, el cliente pagara ${String(
                    Math.ceil(
                      Number(show.totalPrice) / Number(show.finalCredit),
                    ),
                  )}$ en cada pago, semanas/meses depende de el paquete seleccionado`
                : 'Estas seguro de crear un nuevo vehiculo?'}
            </Title>
          </Card.Content>
          <Card.Actions
            style={{justifyContent: 'center', alignItems: 'center'}}>
            <Button
              mode="contained"
              style={{flex: 1, margin: 2}}
              buttonColor="#1C9ADD"
              onPress={() => {
                mutation(show);
                setShow(false);
              }}>
              Ok
            </Button>
            <Button
              mode="contained"
              style={{flex: 1, margin: 2}}
              buttonColor="#1C9ADD"
              onPress={() => {
                setShow(false);
              }}>
              Cancelar
            </Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
};
export default AlertConfirmVehicleRegister;
