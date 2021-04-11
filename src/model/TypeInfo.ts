import {MetadataType} from "../metadata/MetadataType";
import {MetadataLayoutType} from "../layout/MetadataLayoutType";
import {MetadataKind} from "./MetadataKind";
import {PropertyInfo} from "./PropertyInfo";

export class TypeInfo {
    readonly kind: MetadataKind
    readonly type: NativePointer
    readonly size: number
    readonly alignment: number
    readonly stride: number

    name = ""
    mangledName = ""
    properties: PropertyInfo[] = []
    inheritance: NativePointer[] = []
    cases = []
    numberOfEnumCases = 0
    numberOfPayloadEnumCases = 0
    genericTypes: NativePointer[] = []

    constructor(metadata: MetadataType<MetadataLayoutType>) {
        this.kind = metadata.kind
        this.type = metadata.type
        this.size = metadata.size
        this.alignment = metadata.alignment
        this.stride = metadata.stride
    }

    get superClass(): NativePointer | null {
        return this.inheritance.length > 0 ? this.inheritance[0] : null
    }

    property(named: string): PropertyInfo | null {
        let result = this.properties.find((value => value.name === named))
        if (result) {
            return result[0]
        }
        return null
    }
}

export function typeInfo(type: NativePointer) {

}