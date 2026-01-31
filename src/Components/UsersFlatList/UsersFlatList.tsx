import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useMemo} from 'react';
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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

  // Reset page state only when search field changes (not when page changes)
  const fieldFindRef = React.useRef(dataVariables.fieldFind);
  React.useEffect(() => {
    // Only reset if fieldFind actually changed (search was performed)
    if (fieldFindRef.current !== dataVariables.fieldFind) {
      fieldFindRef.current = dataVariables.fieldFind;
      setPage(1);
      setLeftDisabled(true);
      setRightDisabled(totalPages <= 1);
    }
  }, [dataVariables.fieldFind, totalPages]);

  // Update pagination buttons based on current page
  React.useEffect(() => {
    setLeftDisabled(page === 1);
    setRightDisabled(page >= totalPages);
  }, [page, totalPages]);

  const handleRight = useCallback(() => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      setDataVariables((prev: any) => ({...prev, current: nextPage}));
    }
  }, [page, totalPages, setDataVariables]);

  const handleLeft = useCallback(() => {
    if (page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);
      setDataVariables((prev: any) => ({...prev, current: prevPage}));
    }
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
        <View style={styles.emptyIconContainer}>
          <Icon name="database-off" size={40} color="#8E8E93" />
        </View>
        <Text style={styles.emptyTitle}>Sin resultados</Text>
        <Text style={styles.emptyText}>No se encontraron datos</Text>
        {!noBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            activeOpacity={0.7}>
            <Icon name="arrow-left" size={20} color="#1C9ADD" />
            <Text style={styles.backButtonText}>Regresar</Text>
          </TouchableOpacity>
        )}
      </View>
    ),
    [handleGoBack, noBack],
  );

  // Footer component with pagination
  const ListFooterComponent = useMemo(
    () => (
      <View style={styles.footerWrapper}>
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            style={[
              styles.paginationButton,
              leftDisabled && styles.paginationButtonDisabled,
            ]}
            onPress={handleLeft}
            disabled={leftDisabled}
            activeOpacity={0.7}>
            <Icon
              name="chevron-left"
              size={20}
              color={leftDisabled ? '#C7C7CC' : '#1C9ADD'}
            />
          </TouchableOpacity>

          <View style={styles.paginationInfo}>
            <Text style={styles.paginationText}>
              <Text style={styles.paginationCurrent}>{page}</Text>
              <Text style={styles.paginationDivider}> / </Text>
              <Text style={styles.paginationTotal}>{totalPages || 1}</Text>
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.paginationButton,
              (totalPages <= 1 || rightDisabled) &&
                styles.paginationButtonDisabled,
            ]}
            onPress={handleRight}
            disabled={totalPages <= 1 || rightDisabled}
            activeOpacity={0.7}>
            <Icon
              name="chevron-right"
              size={20}
              color={totalPages <= 1 || rightDisabled ? '#C7C7CC' : '#1C9ADD'}
            />
          </TouchableOpacity>
        </View>

        {!initial && !noBack && (
          <TouchableOpacity
            style={styles.footerBackButton}
            onPress={handleGoBack}
            activeOpacity={0.7}>
            <Icon name="arrow-left" size={20} color="#1C9ADD" />
            <Text style={styles.footerBackText}>Regresar</Text>
          </TouchableOpacity>
        )}
      </View>
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator animating={true} color="#1C9ADD" size="large" />
          <Text style={styles.loadingText}>Cargando...</Text>
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

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: width * 0.9,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    gap: 6,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C9ADD',
  },
  footerWrapper: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 6,
    paddingHorizontal: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  paginationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationButtonDisabled: {
    backgroundColor: '#F0F0F0',
  },
  paginationInfo: {
    paddingHorizontal: 16,
  },
  paginationText: {
    fontSize: 14,
  },
  paginationCurrent: {
    fontWeight: '700',
    color: '#1C9ADD',
    fontSize: 16,
  },
  paginationDivider: {
    color: '#C7C7CC',
  },
  paginationTotal: {
    fontWeight: '500',
    color: '#666666',
  },
  footerBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    gap: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  footerBackText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C9ADD',
  },
  listContent: {
    paddingBottom: 16,
  },
});

export default React.memo(UsersFlatList);
