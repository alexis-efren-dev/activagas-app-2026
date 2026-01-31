import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {useQueryGetStates} from '../../services/Configurations/useQueryGetStates';
import {useQueryGetMunicipalities} from '../../services/Configurations/useQueryGetMunicipalities';
import {IStore} from '../../redux/store';
import {colors, spacing, borderRadius, shadows, typography} from '../../styles';

const {width} = Dimensions.get('screen');

interface LocationSelectorProps {
  initialState?: string;
  initialMunicipality?: string;
  initialLocation?: string;
  onStateChange: (state: string) => void;
  onMunicipalityChange: (municipality: string) => void;
  onLocationChange: (location: string) => void;
  disabled?: boolean;
}

interface OptionItemProps {
  item: string;
  isSelected: boolean;
  onSelect: (value: string) => void;
}

// Memoized option item to prevent unnecessary re-renders
const OptionItem = memo<OptionItemProps>(({item, isSelected, onSelect}) => {
  const handlePress = useCallback(() => {
    onSelect(item);
  }, [item, onSelect]);

  return (
    <TouchableOpacity
      style={[styles.optionItem, isSelected && styles.optionItemSelected]}
      onPress={handlePress}
      activeOpacity={0.7}>
      <Text
        style={[styles.optionText, isSelected && styles.optionTextSelected]}>
        {item}
      </Text>
      {isSelected && (
        <Icon name="check-circle" size={18} color={colors.primary.main} />
      )}
    </TouchableOpacity>
  );
});

OptionItem.displayName = 'OptionItem';

interface SelectorDropdownProps {
  label: string;
  icon: string;
  placeholder: string;
  value: string;
  searchValue: string;
  onSearchChange: (text: string) => void;
  onSelect: (value: string) => void;
  options: string[];
  isLoading: boolean;
  isOpen: boolean;
  onToggle: () => void;
  disabled?: boolean;
  emptyMessage?: string;
}

// Memoized dropdown component
const SelectorDropdown = memo<SelectorDropdownProps>(
  ({
    label,
    icon,
    placeholder,
    value,
    searchValue,
    onSearchChange,
    onSelect,
    options,
    isLoading,
    isOpen,
    onToggle,
    disabled = false,
    emptyMessage = 'No hay opciones disponibles',
  }) => {
    const handleSelect = useCallback(
      (selectedValue: string) => {
        onSelect(selectedValue);
      },
      [onSelect],
    );

    const renderItem = useCallback(
      ({item}: {item: string}) => (
        <OptionItem
          item={item}
          isSelected={item === value}
          onSelect={handleSelect}
        />
      ),
      [value, handleSelect],
    );

    const keyExtractor = useCallback((item: string) => item, []);

    const getItemLayout = useCallback(
      (_: any, index: number) => ({
        length: 48,
        offset: 48 * index,
        index,
      }),
      [],
    );

    return (
      <View style={styles.selectorContainer}>
        <View style={styles.labelRow}>
          <View
            style={[
              styles.iconContainer,
              {backgroundColor: `${colors.primary.main}15`},
            ]}>
            <Icon name={icon} size={18} color={colors.primary.main} />
          </View>
          <Text style={styles.label}>{label}</Text>
          {value !== '' && (
            <View style={styles.selectedBadge}>
              <Icon name="check" size={12} color={colors.semantic.success} />
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.inputContainer,
            isOpen && styles.inputContainerActive,
            disabled && styles.inputContainerDisabled,
          ]}
          onPress={onToggle}
          disabled={disabled}
          activeOpacity={0.8}>
          <TextInput
            style={[styles.input, disabled && styles.inputDisabled]}
            value={isOpen ? searchValue : value}
            onChangeText={onSearchChange}
            placeholder={placeholder}
            placeholderTextColor={colors.text.tertiary}
            editable={isOpen && !disabled}
            onFocus={onToggle}
          />
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary.main} />
          ) : (
            <Icon
              name={isOpen ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={disabled ? colors.text.disabled : colors.primary.main}
            />
          )}
        </TouchableOpacity>

        {isOpen && (
          <View style={styles.dropdownContainer}>
            {options.length > 0 ? (
              <FlatList
                data={options}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                getItemLayout={getItemLayout}
                style={styles.optionsList}
                showsVerticalScrollIndicator={true}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={Platform.OS === 'android'}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Icon
                  name="information-outline"
                  size={24}
                  color={colors.text.tertiary}
                />
                <Text style={styles.emptyText}>{emptyMessage}</Text>
              </View>
            )}
          </View>
        )}

        {value !== '' && !isOpen && (
          <View style={styles.selectedValueContainer}>
            <Icon name="map-marker" size={14} color={colors.semantic.success} />
            <Text style={styles.selectedValueText}>{value}</Text>
          </View>
        )}
      </View>
    );
  },
);

SelectorDropdown.displayName = 'SelectorDropdown';

const LocationSelector: React.FC<LocationSelectorProps> = ({
  initialState = '',
  initialMunicipality = '',
  initialLocation = '',
  onStateChange,
  onMunicipalityChange,
  onLocationChange,
  disabled = false,
}) => {
  const userRedux = useSelector((store: IStore) => store.loggedUser);

  // Local state
  const [selectedState, setSelectedState] = useState(initialState);
  const [selectedMunicipality, setSelectedMunicipality] =
    useState(initialMunicipality);
  const [location, setLocation] = useState(initialLocation);
  const [stateSearch, setStateSearch] = useState('');
  const [municipalitySearch, setMunicipalitySearch] = useState('');
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [isMunicipalityOpen, setIsMunicipalityOpen] = useState(false);

  // Sync with initial values when they change
  useEffect(() => {
    if (initialState && initialState !== selectedState) {
      setSelectedState(initialState);
    }
  }, [initialState]);

  useEffect(() => {
    if (initialMunicipality && initialMunicipality !== selectedMunicipality) {
      setSelectedMunicipality(initialMunicipality);
    }
  }, [initialMunicipality]);

  useEffect(() => {
    if (initialLocation && initialLocation !== location) {
      setLocation(initialLocation);
    }
  }, [initialLocation]);

  // API queries
  const {data: statesData, isLoading: statesLoading} = useQueryGetStates({
    idGas: userRedux?.idGas || '',
    fieldFind: stateSearch,
    limit: 100,
  });

  const {data: municipalitiesData, isLoading: municipalitiesLoading} =
    useQueryGetMunicipalities({
      idGas: userRedux?.idGas || '',
      state: selectedState,
      fieldFind: municipalitySearch,
      limit: 100,
    });

  // Memoized options lists
  const stateOptions = useMemo(() => {
    return (
      statesData?.getStatesResolver?.data?.map(item => item.state) || []
    );
  }, [statesData]);

  const municipalityOptions = useMemo(() => {
    return (
      municipalitiesData?.getMunicipalitiesResolver?.data?.map(
        item => item.municipality,
      ) || []
    );
  }, [municipalitiesData]);

  // Callbacks - stable references
  const handleStateSelect = useCallback(
    (state: string) => {
      setSelectedState(state);
      setStateSearch(state);
      setIsStateOpen(false);
      onStateChange(state);
      // Reset municipality when state changes
      if (state !== selectedState) {
        setSelectedMunicipality('');
        setMunicipalitySearch('');
        onMunicipalityChange('');
      }
    },
    [selectedState, onStateChange, onMunicipalityChange],
  );

  const handleMunicipalitySelect = useCallback(
    (municipality: string) => {
      setSelectedMunicipality(municipality);
      setMunicipalitySearch(municipality);
      setIsMunicipalityOpen(false);
      onMunicipalityChange(municipality);
    },
    [onMunicipalityChange],
  );

  const handleStateSearchChange = useCallback((text: string) => {
    setStateSearch(text);
  }, []);

  const handleMunicipalitySearchChange = useCallback((text: string) => {
    setMunicipalitySearch(text);
  }, []);

  const toggleStateDropdown = useCallback(() => {
    setIsStateOpen(prev => !prev);
    setIsMunicipalityOpen(false);
    if (!isStateOpen) {
      setStateSearch('');
    }
  }, [isStateOpen]);

  const toggleMunicipalityDropdown = useCallback(() => {
    if (selectedState) {
      setIsMunicipalityOpen(prev => !prev);
      setIsStateOpen(false);
      if (!isMunicipalityOpen) {
        setMunicipalitySearch('');
      }
    }
  }, [selectedState, isMunicipalityOpen]);

  const handleLocationChangeInternal = useCallback(
    (text: string) => {
      setLocation(text);
      onLocationChange(text);
    },
    [onLocationChange],
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerIconContainer}>
          <Icon name="map-marker-radius" size={20} color={colors.primary.main} />
        </View>
        <Text style={styles.headerTitle}>Dirección del Cliente</Text>
      </View>

      <SelectorDropdown
        label="Estado"
        icon="map"
        placeholder="Buscar estado..."
        value={selectedState}
        searchValue={stateSearch}
        onSearchChange={handleStateSearchChange}
        onSelect={handleStateSelect}
        options={stateOptions}
        isLoading={statesLoading}
        isOpen={isStateOpen}
        onToggle={toggleStateDropdown}
        disabled={disabled}
        emptyMessage="No se encontraron estados"
      />

      <SelectorDropdown
        label="Municipio"
        icon="city"
        placeholder={
          selectedState ? 'Buscar municipio...' : 'Primero selecciona un estado'
        }
        value={selectedMunicipality}
        searchValue={municipalitySearch}
        onSearchChange={handleMunicipalitySearchChange}
        onSelect={handleMunicipalitySelect}
        options={municipalityOptions}
        isLoading={municipalitiesLoading}
        isOpen={isMunicipalityOpen}
        onToggle={toggleMunicipalityDropdown}
        disabled={disabled || !selectedState}
        emptyMessage={
          selectedState
            ? 'No se encontraron municipios'
            : 'Selecciona un estado primero'
        }
      />

      {/* Location/Address Input */}
      <View style={styles.selectorContainer}>
        <View style={styles.labelRow}>
          <View
            style={[
              styles.iconContainer,
              {backgroundColor: `${colors.primary.main}15`},
            ]}>
            <Icon name="home-map-marker" size={18} color={colors.primary.main} />
          </View>
          <Text style={styles.label}>Dirección</Text>
          {location !== '' && (
            <View style={styles.selectedBadge}>
              <Icon name="check" size={12} color={colors.semantic.success} />
            </View>
          )}
        </View>

        <View
          style={[
            styles.inputContainer,
            disabled && styles.inputContainerDisabled,
          ]}>
          <TextInput
            style={[styles.input, disabled && styles.inputDisabled]}
            value={location}
            onChangeText={handleLocationChangeInternal}
            placeholder="Ingresa la dirección completa..."
            placeholderTextColor={colors.text.tertiary}
            editable={!disabled}
            multiline
            numberOfLines={2}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.85,
    marginVertical: spacing.sm,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.primary.main}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  headerTitle: {
    ...typography.h6,
    color: colors.text.inverse,
  },
  selectorContainer: {
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  },
  label: {
    ...typography.body2,
    fontWeight: '600',
    color: colors.text.inverse,
    flex: 1,
  },
  selectedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: `${colors.semantic.success}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border.medium,
    paddingHorizontal: spacing.md,
    minHeight: 48,
    ...shadows.sm,
  },
  inputContainerActive: {
    borderColor: colors.primary.main,
    borderWidth: 2,
  },
  inputContainerDisabled: {
    backgroundColor: colors.background.secondary,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    ...typography.body1,
    color: colors.text.primary,
    paddingVertical: spacing.sm,
  },
  inputDisabled: {
    color: colors.text.disabled,
  },
  dropdownContainer: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.sm,
    marginTop: spacing.xs,
    maxHeight: 200,
    ...shadows.md,
    overflow: 'hidden',
  },
  optionsList: {
    maxHeight: 200,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 48,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border.light,
  },
  optionItemSelected: {
    backgroundColor: `${colors.primary.main}10`,
  },
  optionText: {
    ...typography.body2,
    color: colors.text.primary,
    flex: 1,
  },
  optionTextSelected: {
    color: colors.primary.main,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  emptyText: {
    ...typography.body2,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  selectedValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
    gap: 4,
  },
  selectedValueText: {
    ...typography.caption,
    color: colors.semantic.success,
    fontWeight: '500',
  },
});

export default memo(LocationSelector);
