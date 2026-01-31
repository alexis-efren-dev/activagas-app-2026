/* eslint-disable react-hooks/exhaustive-deps */
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Dimensions, Text, View, StyleSheet, Platform} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ActivityIndicator} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import UsersFlatList from '../../../Components/UsersFlatList/UsersFlatList';
import {useQueryGetGas} from '../../../services/Stock/useQueryGetGas';
import {IStore} from '../../../redux/store';

const {width} = Dimensions.get('screen');

interface IDashboard {
  navigation: StackNavigationProp<any, any>;
}

const Dashboard: React.FC<IDashboard> = ({navigation}) => {
  const user = useSelector((store: IStore) => store.loggedUser);
  const [dataVariables, setDataVariables] = React.useState<any>({
    current: 1,
    limit: 2,
    fieldFind: '',
    idGas: '',
  });

  const {
    data: data2,
    refetch: refetch2,
    isLoading,
    isError,
    isFetching,
  } = useQueryGetGas({
    current: dataVariables.current,
    limit: dataVariables.limit,
    fieldFind: dataVariables.fieldFind,
  });

  React.useEffect(() => {
    if (user) {
      if (user.idGas && user.idGas !== '') {
        setDataVariables({...dataVariables, idGas: user.idGas});
      }
    }
  }, [user]);

  React.useEffect(() => {
    if (dataVariables.idGas !== '') {
      refetch2();
    }
  }, [JSON.stringify(dataVariables)]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} color="#1C9ADD" size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorIconContainer}>
          <Icon name="server-off" size={48} color="#E53935" />
        </View>
        <Text style={styles.errorTitle}>Error de conexión</Text>
        <Text style={styles.errorText}>
          No se pudo conectar con el servidor. Por favor, inténtalo más tarde.
        </Text>
      </View>
    );
  }

  return (
    <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Icon name="store" size={32} color="#1C9ADD" />
          </View>
          <Text style={styles.headerTitle}>Gaseras</Text>
          <Text style={styles.headerSubtitle}>
            Selecciona una gasera para continuar
          </Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {data2 ? (
            <UsersFlatList
              initial={true}
              navigation={navigation}
              isFetching={isFetching}
              data={data2.gaserasTableResolver.data}
              limitPerPage={2}
              toScreen={'VerifyPay'}
              setDataVariables={setDataVariables}
              dataVariables={dataVariables}
              totalItems={data2.gaserasTableResolver.total}
              isGas={true}
            />
          ) : null}
        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
});

export default Dashboard;
