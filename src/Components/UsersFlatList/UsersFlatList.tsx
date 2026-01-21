import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {Dimensions, ScrollView, View} from 'react-native';
import {
  ActivityIndicator,
  Card,
  IconButton,
  Paragraph,
  Title,
} from 'react-native-paper';
import {useSelector} from 'react-redux';
import dataFormFindClient from '../../DataForms/dataFormFindClient.json';

import {DynamicForm} from '../DynamicForms/DynamicForm';
import CardEmergencyList from './CardEmergencyList';
import CardFlatList from './CardFlatList';
import CardGasList from './CardGasList';
import CardSerial from './CardSerial';
import CardVehicleList from './CardVehicleList';
import { IStore } from '../../redux/store';
CardVehicleList;
const {width} = Dimensions.get('screen');
interface IFlat {
  totalItems: number;
  limitPerPage: number;
  data: any[];
  setDataVariables: any;
  dataVariables: any;
  isFetching: boolean;
  toScreen: string;
  navigation: StackNavigationProp<any, any>;
  isGas?: boolean;
  serialNumber?: any;
  isVehicle?: any;
  isAccounting?: any;
  isEmergencyClient?: any;
  initial?: any;
  idGas?: any;
  noBack?: any;
  withFunction?: any;
}

const UsersFlatList: React.FC<IFlat> = ({
  totalItems,
  limitPerPage,
  data,
  setDataVariables,
  dataVariables,
  isFetching,
  toScreen,
  navigation,
  serialNumber,
  isGas,
  isVehicle,
  isAccounting,
  isEmergencyClient,
  initial = false,
  idGas = false,
  noBack = false,
  withFunction = false,
}) => {
  const {plates} = useSelector((store: IStore) => store.currentPlates);
  const [controlCard, setControlCard] = React.useState<any>(1);
  const [rightDisabled, setRightDisabled] = React.useState<any>(false);
  const [leftDisabled, setLeftDisabled] = React.useState<any>(true);
  const [page, setPage] = React.useState<any>(1);
  const [totalPages, setTotalPages] = React.useState<any>(false);
  React.useEffect(() => {
    const parsedlimit = limitPerPage > totalItems ? 1 : limitPerPage;
    const getTotalPages = Math.trunc(totalItems / parsedlimit);

    const getPlusPage = totalItems % parsedlimit === 0 ? 0 : 1;
    setTotalPages(getTotalPages + getPlusPage);
  }, [totalItems]);
  React.useEffect(() => {
    setControlCard(1);
  }, [dataVariables]);
  const handleRight = () => {
    if (page + 1 === totalPages) {
      setRightDisabled(true);
    }
    setDataVariables({...dataVariables, current: page + 1});
    setPage(page + 1);
    setLeftDisabled(false);
  };
  const handleLeft = () => {
    if (page - 1 === 1) {
      setLeftDisabled(true);
    }
    setDataVariables({...dataVariables, current: page - 1});
    setPage(page - 1);
    setRightDisabled(false);
  };

  const buttonInfo = {
    icon: 'arrow-right-bold',
    color: 'black',
    mode: 'contained',
  };
  const handleFind = (dataFind: any) => {
    setDataVariables((oldData: any) => ({
      ...oldData,
      fieldFind: dataFind.fieldFind,
    }));
  };
  return (
    <ScrollView>
      <View
        style={{
          height: '100%',

          width: width * 0.9,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {isEmergencyClient ? null : (
            <DynamicForm
              isFetching={isFetching}
              withoutButton={true}
              onSubmit={handleFind}
              isLoading={true}
              json={dataFormFindClient}
              labelSubmit="Entrar"
              buttonProps={buttonInfo}
            />
          )}
        </View>
        {data.length <= 0 ? (
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <IconButton icon="database" iconColor={'black'} size={60} />
            <Title>No se encontraron datos</Title>
            <View style={{justifyContent: 'center'}}>
              <IconButton
                icon="arrow-left-bold"
                iconColor="#000"
                size={50}
                onPress={() => {
                  if (plates === '') {
                    navigation.goBack();
                  } else {
                    navigation.goBack();
                    navigation.goBack();
                  }
                }}
              />
            </View>
          </View>
        ) : (
          <>
            {isFetching ? (
              <ActivityIndicator animating={true} color={'white'} />
            ) : (
              <View>
                <Card.Content>
                  {data.map((item: any, index: number) => {
                    if (isGas) {
                      return (
                        <View key={index.toString()}>
                          <CardGasList
                            item={item}
                            toScreen={toScreen}
                            navigation={navigation}
                          />
                        </View>
                      );
                    } else if (isVehicle) {
                      return (
                        <View key={index.toString()}>
                          <CardVehicleList
                            withFunction={withFunction}
                            item={item}
                            toScreen={toScreen}
                            navigation={navigation}
                          />
                        </View>
                      );
                    } else if (isEmergencyClient) {
                      return (
                        <View key={index.toString()}>
                          <CardEmergencyList
                            item={item}
                            toScreen={toScreen}
                            navigation={navigation}
                          />
                        </View>
                      );
                    } else if (isAccounting) {
                      return (
                        <View key={index.toString()}>
                          <CardSerial
                            item={item}
                            toScreen={toScreen}
                            navigation={navigation}
                          />
                        </View>
                      );
                    } else {
                      return (
                        <View key={index.toString()}>
                          <CardFlatList
                            idGas={idGas}
                            item={item}
                            serialNumber={serialNumber}
                            toScreen={toScreen}
                            navigation={navigation}
                          />
                        </View>
                      );
                    }
                  })}
                </Card.Content>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <IconButton
                    icon="arrow-left-bold"
                    iconColor={'black'}
                    size={20}
                    disabled={leftDisabled}
                    onPress={handleLeft}
                  />
                  <Paragraph>
                    Pagina {page} de {totalPages}
                  </Paragraph>
                  <IconButton
                    icon="arrow-right-bold"
                    iconColor={'black'}
                    disabled={totalPages <= 1 ? true : rightDisabled}
                    size={20}
                    onPress={handleRight}
                  />
                </View>
                {initial || noBack ? null : (
                  <View style={{width: width * 0.9, flex: 1}}>
                    <IconButton
                      icon="arrow-left-bold"
                      iconColor="#1C9ADD"
                      size={50}
                      onPress={() => {
                        if (plates === '') {
                          navigation.goBack();
                        } else {
                          navigation.goBack();
                          navigation.goBack();
                        }
                      }}
                    />
                  </View>
                )}
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};
export default UsersFlatList;
