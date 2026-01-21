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
      icon="close-thick"
      size={50}
      style={{backgroundColor: 'red', top: -20}}
    />
  );
const AlertError = () => {
  const dispatch = useDispatch();
  const {messageError, showError} = useSelector((data:IStore) => data.alerts);
  const containerStyle = {
    backgroundColor: 'transparent',
    padding: width * 0.15,
  };

  return (
    <Portal>
      <Modal
        visible={showError}
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
            <LeftContent/>
          </View>
          <Card.Content
            style={{justifyContent: 'center', alignItems: 'center'}}>
            <Title style={{fontSize: 15}}>{messageError}</Title>
          </Card.Content>
          <Card.Actions
            style={{justifyContent: 'center', alignItems: 'center'}}>
            <Button
              mode="contained"
              style={{width: '100%'}}
              buttonColor="red"
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
              Ok
            </Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
};
export default AlertError;
