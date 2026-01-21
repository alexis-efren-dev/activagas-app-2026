import React from 'react';
import {ActivityIndicator, TouchableWithoutFeedback, View} from 'react-native';
import {Avatar, IconButton, Title} from 'react-native-paper';
import HandlerVerification from '../../../Components/Verifications/HandlerVerification';
import {useQueryGetVerificationData} from '../../../services/Verification/useQueryGetVerificationData';
const VerifyUnit = (props: any) => {
  const [dataVariables, setDataVariables] = React.useState<any>(false);
  const [handlerData, setHandlerData] = React.useState<any>(false);
  const {data, isError, isLoading, refetch} = useQueryGetVerificationData({
    _id: dataVariables,
  });
  React.useEffect(() => {
    if (props) {
      if (props.route) {
        if (props.route.params) {
          if (props.route.params.item) {
            setDataVariables(props.route.params.item._id);
          } else {
            setDataVariables(false);
          }
        }
      }
    }
  }, [props]);
  React.useEffect(() => {
    if (dataVariables) {
      refetch();
    }
  }, [dataVariables]);
  React.useEffect(() => {
    if (data) {
      setHandlerData(data.getDateVerificationResolver);
    }
  }, [data]);
  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator animating={true} color={'red'} />
      </View>
    );
  }
  if (isError) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <IconButton icon="water-boiler-alert" iconColor={'black'} size={80} />
        <Title>Error de servidor, intentalo mas tarde</Title>
      </View>
    );
  }
  const {navigation} = props;
  const LeftContent = (props: any) => (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.goBack();
      }}>
      <Avatar.Icon
        {...props}
        icon="arrow-left"
        style={{backgroundColor: '#1C9ADD'}}
      />
    </TouchableWithoutFeedback>
  );

  if (handlerData) {
    if (handlerData.date == 'false') {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <LeftContent />
          <IconButton icon="water-boiler-alert" iconColor={'black'} size={80} />
          <Title>Este vehiculo no tiene verificacion</Title>
        </View>
      );
    } else {
      return (
        <HandlerVerification
          navigation={navigation}
          data={handlerData}
          request={props.route.params.item} />
      );
    }
  }
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator animating={true} color={'red'} />
    </View>
  );
};
export default VerifyUnit;
