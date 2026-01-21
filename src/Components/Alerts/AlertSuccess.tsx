import React from 'react';
import {Dimensions, View} from 'react-native';
import {Avatar, Button, Card, Modal, Portal, Title} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import { getAlertSuccess } from '../../redux/states/alertsReducerState';
import { IStore } from '../../redux/store';
const {width} = Dimensions.get('screen');
const LeftContent = (props: any) => (
    <Avatar.Icon
      {...props}
      icon="thumb-up-outline"
      size={50}
      style={{backgroundColor: '#1C9ADD', top: -20}}
    />
  );
const AlertSuccess = () => {
  const dispatch = useDispatch();
  const {message, show} = useSelector((data: IStore) => data.alerts);
  const containerStyle = {
    backgroundColor: 'transparent',
    padding: width * 0.15,
  };


  return (
    <Portal>
      <Modal
        visible={show}
        onDismiss={() =>
          dispatch(
            getAlertSuccess({
              message: '',
              show: false,
              messageError: '',
              showError: false,
            }),
          )
        }
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
            <Title style={{fontSize: 15}}>{message}</Title>
          </Card.Content>
          <Card.Actions
            style={{justifyContent: 'center', alignItems: 'center'}}>
            <Button
              mode="contained"
              style={{width: '100%'}}
              buttonColor="#1C9ADD"
              onPress={() =>
                dispatch(
                  getAlertSuccess({
                    message: '',
                    show: false,
                    messageError: '',
                    showError: false,
                  }),
                )
              }>
              Hecho
            </Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
};
export default AlertSuccess;
