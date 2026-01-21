import React from 'react';
import {Paragraph, Title} from 'react-native-paper';
import {cardStyles} from './GenericListCard';

interface CardFieldProps {
  /** Label text (displayed as title) */
  label: string;
  /** Value text (displayed as paragraph) */
  value: string | number | undefined | null;
  /** Fallback value if value is undefined/null */
  fallback?: string;
}

/**
 * Card Field Component
 *
 * Renders a label-value pair with consistent styling.
 * Use inside GenericListCard or any Card component.
 *
 * @example
 * ```tsx
 * <CardField label="Nombre" value={user.firstName} />
 * <CardField label="Teléfono" value={user.phone} fallback="N/A" />
 * ```
 */
export const CardField: React.FC<CardFieldProps> = React.memo(
  ({label, value, fallback = '-'}) => {
    return (
      <>
        <Title style={cardStyles.title}>{label}</Title>
        <Paragraph style={cardStyles.text}>
          {value ?? fallback}
        </Paragraph>
      </>
    );
  },
);

export default CardField;
