import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useMemo} from 'react';
import {Dimensions, FlatList, ListRenderItem, View, StyleSheet} from 'react-native';
import {
  ActivityIndicator,
  Card,
  IconButton,
  Paragraph,
  Title,
} from 'react-native-paper';
import {useSelector} from 'react-redux';
import dataFormFindClient from '../../DataForms/dataFormFindClient.json';
import {IStore} from '../../redux/store';
import {DynamicForm} from '../DynamicForms/DynamicForm';
import CardEmergencyList from './CardEmergencyList';
import CardFlatList from './CardFlatList';
import CardGasList from './CardGasList';
import CardSerial from './CardSerial';
import CardVehicleList from './CardVehicleList';

const {width} = Dimensions.get('screen');

/** Estimated item height for getItemLayout optimization */
const ITEM_HEIGHT = 120;

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

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: width * 0.9,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonContainer: {
    justifyContent: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  footerContainer: {
    width: width * 0.9,
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
});

const buttonInfo = {
  icon: 'arrow-right-bold',
  color: 'black',
  mode: 'contained',
};

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
  const [rightDisabled, setRightDisabled] = React.useState<boolean>(false);
  const [leftDisabled, setLeftDisabled] = React.useState<boolean>(true);
  const [page, setPage] = React.useState<number>(1);

  // Calculate total pages
  const totalPages = useMemo(() => {
    const parsedLimit = limitPerPage > totalItems ? 1 : limitPerPage;
    const baseTotalPages = Math.trunc(totalItems / parsedLimit);
    const extraPage = totalItems % parsedLimit === 0 ? 0 : 1;
    return baseTotalPages + extraPage;
  }, [totalItems, limitPerPage]);

  // Reset page state when data variables change
  React.useEffect(() => {
    setPage(1);
    setLeftDisabled(true);
    setRightDisabled(totalPages <= 1);
  }, [dataVariables, totalPages]);

  const handleRight = useCallback(() => {
    const nextPage = page + 1;
    if (nextPage === totalPages) {
      setRightDisabled(true);
    }
    setDataVariables((prev: any) => ({...prev, current: nextPage}));
    setPage(nextPage);
    setLeftDisabled(false);
  }, [page, totalPages, setDataVariables]);

  const handleLeft = useCallback(() => {
    const prevPage = page - 1;
    if (prevPage === 1) {
      setLeftDisabled(true);
    }
    setDataVariables((prev: any) => ({...prev, current: prevPage}));
    setPage(prevPage);
    setRightDisabled(false);
  }, [page, setDataVariables]);

  const handleFind = useCallback(
    (dataFind: any) => {
      setDataVariables((oldData: any) => ({
        ...oldData,
        fieldFind: dataFind.fieldFind,
      }));
    },
    [setDataVariables],
  );

  const handleGoBack = useCallback(() => {
    if (plates === '') {
      navigation.goBack();
    } else {
      navigation.goBack();
      navigation.goBack();
    }
  }, [plates, navigation]);

  // Optimized key extractor
  const keyExtractor = useCallback(
    (item: any, index: number) => item._id || item.id || index.toString(),
    [],
  );

  // getItemLayout for fixed-height items (improves scroll performance)
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  // Render item based on list type
  const renderItem: ListRenderItem<any> = useCallback(
    ({item}) => {
      if (isGas) {
        return (
          <CardGasList
            item={item}
            toScreen={toScreen}
            navigation={navigation}
          />
        );
      }
      if (isVehicle) {
        return (
          <CardVehicleList
            withFunction={withFunction}
            item={item}
            toScreen={toScreen}
            navigation={navigation}
          />
        );
      }
      if (isEmergencyClient) {
        return (
          <CardEmergencyList
            item={item}
            toScreen={toScreen}
            navigation={navigation}
          />
        );
      }
      if (isAccounting) {
        return (
          <CardSerial
            item={item}
            toScreen={toScreen}
            navigation={navigation}
          />
        );
      }
      return (
        <CardFlatList
          idGas={idGas}
          item={item}
          serialNumber={serialNumber}
          toScreen={toScreen}
          navigation={navigation}
        />
      );
    },
    [
      isGas,
      isVehicle,
      isEmergencyClient,
      isAccounting,
      toScreen,
      navigation,
      withFunction,
      idGas,
      serialNumber,
    ],
  );

  // Empty list component
  const ListEmptyComponent = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <IconButton icon="database" iconColor={'black'} size={60} />
        <Title>No se encontraron datos</Title>
        <View style={styles.backButtonContainer}>
          <IconButton
            icon="arrow-left-bold"
            iconColor="#000"
            size={50}
            onPress={handleGoBack}
          />
        </View>
      </View>
    ),
    [handleGoBack],
  );

  // Footer component with pagination
  const ListFooterComponent = useMemo(
    () => (
      <>
        <View style={styles.paginationContainer}>
          <IconButton
            icon="arrow-left-bold"
            iconColor={'black'}
            size={20}
            disabled={leftDisabled}
            onPress={handleLeft}
          />
          <Paragraph>
            Pagina {page} de {totalPages || 1}
          </Paragraph>
          <IconButton
            icon="arrow-right-bold"
            iconColor={'black'}
            disabled={totalPages <= 1 || rightDisabled}
            size={20}
            onPress={handleRight}
          />
        </View>
        {!initial && !noBack && (
          <View style={styles.footerContainer}>
            <IconButton
              icon="arrow-left-bold"
              iconColor="#1C9ADD"
              size={50}
              onPress={handleGoBack}
            />
          </View>
        )}
      </>
    ),
    [
      leftDisabled,
      rightDisabled,
      page,
      totalPages,
      initial,
      noBack,
      handleLeft,
      handleRight,
      handleGoBack,
    ],
  );

  // Header component with search
  const ListHeaderComponent = useMemo(
    () =>
      !isEmergencyClient ? (
        <View style={styles.searchContainer}>
          <DynamicForm
            isFetching={isFetching}
            withoutButton={true}
            onSubmit={handleFind}
            isLoading={true}
            json={dataFormFindClient}
            labelSubmit="Entrar"
            buttonProps={buttonInfo}
          />
        </View>
      ) : null,
    [isEmergencyClient, isFetching, handleFind],
  );

  // Loading state
  if (isFetching) {
    return (
      <View style={styles.container}>
        {ListHeaderComponent}
        <View style={styles.emptyContainer}>
          <ActivityIndicator animating={true} color={'red'} size="large" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={data.length > 0 ? ListFooterComponent : null}
        contentContainerStyle={styles.listContent}
        // Performance optimizations
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={10}
        updateCellsBatchingPeriod={50}
      />
    </View>
  );
};

export default React.memo(UsersFlatList);
