import * as React from 'react';
import { FieldType, FieldTypeDefinition, SectionContext, SectionType } from './types';
declare const getFieldTypeDefinition: (fieldType: FieldType) => FieldTypeDefinition<any, any>;
declare const getSectionFactory: (sectionType: SectionType) => ((sectionContext: SectionContext) => React.ReactNode) | undefined;
export { getFieldTypeDefinition, getSectionFactory };
