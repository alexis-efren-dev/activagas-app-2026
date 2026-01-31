# FlashList Migration Report

## Overview
This document tracks the migration from React Native's FlatList to Shopify's FlashList for improved performance.

## Date
2026-01-21

## Package Installation
- **Package**: `@shopify/flash-list@2.2.0`
- **Installation Method**: `bun add @shopify/flash-list`
- **iOS Dependencies**: Installed via CocoaPods (`pod install`)

## What is FlashList?
FlashList is a drop-in replacement for FlatList with significantly better performance:
- Up to 10x faster than FlatList for large lists
- Automatic optimization of list rendering
- Lower memory footprint
- Smoother scrolling experience

## Files Modified

### 1. `/src/Components/UsersFlatList/UsersFlatList.tsx`
**Changes:**
- Added import: `import {FlashList} from '@shopify/flash-list';`
- Removed import: `Platform` from react-native (no longer needed)
- Replaced `<FlatList>` with `<FlashList>`
- Added required prop: `estimatedItemSize={150}`
- Removed props (no longer needed with FlashList):
  - `removeClippedSubviews`
  - `maxToRenderPerBatch`
  - `updateCellsBatchingPeriod`
  - `initialNumToRender`
  - `windowSize`

**Estimated Item Size:**
- Set to `150px` based on the Card components used in the list
- This is an estimate of the average height of list items (Cards with titles, paragraphs, and buttons)

**Components Using This List:**
This component is used across multiple screens for displaying:
- Client lists (CardFlatList)
- Gas station lists (CardGasList)
- Vehicle lists (CardVehicleList)
- Serial number lists (CardSerial)
- Emergency activation lists (CardEmergencyList)

## Screens Affected
The migration affects the following screens (all using UsersFlatList component):

### Accounting Module
1. `/src/Screens/Accounting/Dashboard/Dashboard.tsx` - Client list
2. `/src/Screens/Accounting/GetVehicles/GetVehicles.tsx` - Vehicle list
3. `/src/Screens/ScreensActivator/Accounting/GetSerialAccounting.tsx` - Serial number list

### Client Module
4. `/src/Screens/Client/Dashboard/Dashboard.tsx` - Vehicle list
5. `/src/Screens/Client/Support/Support.tsx` - Vehicle list with WhatsApp support
6. `/src/Screens/Client/EmergencyDashboard/EmergencyDashboard.tsx` - Emergency activation list

### Stock Module
7. `/src/Screens/Stock/Dashboard/Dashboard.tsx` - Gas station list

### Routes Edit Module
8. `/src/Screens/RoutesEdit/Dashboard.tsx` - Client list
9. `/src/Screens/RoutesEdit/EnableVehicle.tsx` - Vehicle list (disabled vehicles)
10. `/src/Screens/RoutesEdit/UpdateVehicle.tsx` - Vehicle list (for editing)

### Verification Module
11. `/src/Screens/Verification/Dashboard/Dashboard.tsx` - Gas station list
12. `/src/Screens/Verification/GetVehicles/GetVehicles.tsx` - Vehicle list

### Maintenance Module
13. `/src/Screens/Maintenance/GetVehicles/GetVehicles.tsx` - Vehicle list

### Register Activation
14. `/src/Components/RegisterActivation/GetPrevClients.tsx` - Previous client list

## Performance Benefits Expected

### Before (FlatList)
- Manual optimization required with props like `windowSize`, `maxToRenderPerBatch`
- `removeClippedSubviews` needed for Android optimization
- Higher memory usage on long lists
- Potential scroll jank with many items

### After (FlashList)
- Automatic optimization
- Better recycling of list items
- Lower memory footprint
- Smoother scrolling experience
- Faster initial render
- Better performance on both iOS and Android

## Configuration Details

### estimatedItemSize Reasoning
- **Value**: 150px
- **Based on**: Average height of Card components containing:
  - Card padding and elevation
  - Title component (1-2 lines)
  - 2-3 Paragraph components
  - IconButton (40px)
  - Margins between elements

### Props Retained
All existing FlatList props that are compatible with FlashList were retained:
- `data` - List data array
- `renderItem` - Item render function
- `keyExtractor` - Unique key function
- `ListHeaderComponent` - Search form
- `ListFooterComponent` - Pagination controls
- `ListEmptyComponent` - Empty state UI
- `contentContainerStyle` - Styling

## Testing Recommendations

1. **Pagination Testing**: Verify pagination controls work correctly across all screens
2. **Search Functionality**: Test search/filter functionality in list headers
3. **Navigation**: Ensure tapping items navigates correctly to detail screens
4. **Empty States**: Verify empty list states display correctly
5. **Loading States**: Check loading indicators work during data fetch
6. **Scroll Performance**: Test scrolling on lists with many items (20+ items)
7. **Memory Usage**: Monitor memory usage during extended scrolling
8. **Different Screen Sizes**: Test on various device sizes (phones and tablets)

## Platform-Specific Notes

### iOS
- CocoaPods dependencies installed successfully
- No additional configuration required

### Android
- FlashList works out of the box
- No additional Gradle configuration needed
- Expected to see biggest performance improvement on low-end devices

## Rollback Plan
If issues arise, rollback is simple:
1. Change `FlashList` back to `FlatList` in UsersFlatList.tsx
2. Remove `estimatedItemSize` prop
3. Add back removed optimization props
4. Revert package.json changes and run `bun install`

## References
- FlashList Documentation: https://shopify.github.io/flash-list/
- FlashList GitHub: https://github.com/Shopify/flash-list
- Migration Guide: https://shopify.github.io/flash-list/docs/guides/migrating-from-flatlist

## Notes
- No breaking changes to existing functionality
- All card components (CardFlatList, CardGasList, etc.) remain unchanged
- No changes to GraphQL queries or data fetching logic
- No changes to navigation or routing logic
