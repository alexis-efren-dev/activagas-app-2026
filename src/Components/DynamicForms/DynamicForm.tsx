/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
/* eslint-disable curly */
import {Formik} from 'formik';
import React from 'react';
import {Dimensions, View} from 'react-native';
import {Button} from 'react-native-paper';
import * as Yup from 'yup';
import {DynamicInputBasic} from './DynamicInputBasic';
const {width} = Dimensions.get('screen');

interface IDynamicForm {
  json: any;
  onSubmit: any;
  isLoading: any;
  labelSubmit: string;
  buttonProps: any;
  cancelableButton?: any;
  cancelLabel?: any;
  cancelableAction?: any;
  cancelableStyle?: any;
  extractInfo?: any;
  showButton?: any;
  isFetching?: any;
  setExtractData?: any;
  [x: string]: any;
}
export const DynamicForm: React.FC<IDynamicForm> = ({
  json,
  onSubmit,
  isLoading,
  labelSubmit,
  buttonProps,
  withoutButton,
  isInitialDisabled,
  cancelableButton,
  cancelLabel,
  cancelableAction,
  cancelableStyle,
  extractInfo,
  showButton = true,
  isFetching = false,
  setExtractData,
  children,
}) => {
  const initialValues: {[x: string]: any} = {};
  const requiredFields: {[x: string]: any} = {};
  if (buttonProps.style) {
    if (!buttonProps.style.width) {
      const oldStyles = {...buttonProps.style};
      oldStyles.width = width * 0.8;
      buttonProps.style = oldStyles;
    }
  }

  for (const input of json) {
    initialValues[input.name] = input.value;
    if (!input.validations) continue;
    let schema = Yup.string();
    for (const rule of input.validations) {
      if (rule.type === 'required') {
        schema = schema.required('Este campo es requerido');
      }
      if (rule.type === 'minLength') {
        schema = schema.min(
          rule.value as number,
          `Ingresar minimo ${rule.value} caracteres`,
        );
      }
      if (rule.type === 'maxLength') {
        schema = schema.max(
          rule.value as number,
          `Ingresar maximo ${rule.value} caracteres`,
        );
      }
      //TODO add more rules
    }
    requiredFields[input.name] = schema;
  }
  const validationSchema = Yup.object({...requiredFields});

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={onSubmit}>
      {formik => {
        const getValues = formik.values != formik.initialValues;
        const getErrors = !formik.isValid;
        const getDisabled =
          isInitialDisabled === false
            ? false
            : getValues && !getErrors
            ? false
            : true;

        return (
          <>
            {json.map(
              ({
                name,
                label,
                keyboard,
                errormessagestyles,
                customStyle,
                theme,
                colorIcon,
                iconDirection,
                icon,
                secureTextEntry,
                onlyLettersAndNumber = false,
                isUpper = false,
                helper = '',
                iconUri = '',
                typeFind = false,
                editable = true,
                doNotShow = false,
              }: any) => {
                if (!customStyle.width) {
                  customStyle.width = width * 0.8;
                }
                return (
                  <DynamicInputBasic
                    doNotShow={doNotShow}
                    onlyLettersAndNumber={onlyLettersAndNumber}
                    isFetching={isFetching}
                    editable={editable}
                    key={name}
                    extractInfo={extractInfo}
                    iconUri={iconUri}
                    helper={helper}
                    isUpper={isUpper}
                    customStyle={customStyle}
                    theme={theme}
                    handleSubmit={formik.handleSubmit}
                    colorIcon={colorIcon}
                    iconDirection={iconDirection}
                    disabled={getDisabled}
                    icon={icon}
                    withoutButton={withoutButton}
                    keyboard={keyboard}
                    onChange={formik.setFieldValue}
                    name={name}
                    secureTextEntry={Boolean(secureTextEntry)}
                    label={label}
                    errormessagestyles={errormessagestyles}
                    error={formik.errors}
                    typeFind={typeFind}
                    setExtractData={setExtractData}
                  />
                );
              },
            )}
            {children}
            {!withoutButton ? (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                {cancelableButton ? (
                  <Button
                    onPress={() => {
                      cancelableAction();
                    }}
                    loading={isLoading}
                    {...cancelableStyle}>
                    {cancelLabel}
                  </Button>
                ) : null}
                {showButton && (
                  <Button
                    onPress={() => {
                      formik.handleSubmit();
                    }}
                    loading={isLoading}
                    {...buttonProps}>
                    {labelSubmit}
                  </Button>
                )}
              </View>
            ) : null}
          </>
        );
      }}
    </Formik>
  );
};
