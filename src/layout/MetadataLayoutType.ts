import {TypeDescriptor} from './TypeDescriptor'
import {MetadataKind} from "../model/MetadataKind";

export interface MetadataLayoutType {
    readonly kind: MetadataKind
}

export interface NominalMetadataLayoutType<Descriptor extends TypeDescriptor> extends MetadataLayoutType {
    readonly typeDescriptor: Descriptor
}
