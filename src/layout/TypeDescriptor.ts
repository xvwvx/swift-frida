import {TargetTypeGenericContextDescriptorHeader} from "./TargetTypeGenericContextDescriptorHeader";

export enum ContextDescriptorKind {
    Module = 0,
    Extension = 1,
    Anonymous = 2,
    Protocol = 3,
    OpaqueType = 4,
    Type_First = 16,
    Class = Type_First,
    Struct = Type_First + 1,
    Enum = Type_First + 2,
    Type_Last = 31
}

export class ContextDescriptorFlags {
    private value: number

    constructor(value: number) {
        this.value = value
    }

    get kind(): ContextDescriptorKind {
        return this.value & 0x1F
    }

    get isGeneric() {
        return (this.value & 0x80) != 0;
    }

    get isUnique() {
        return (this.value & 0x40) != 0;
    }

    get version() {
        return (this.value >> 8) & 0xFF;
    }

    get kindSpecificFlags() {
        return (this.value >> 16) & 0xFFFF;
    }
}

export interface TypeDescriptor {
    flags: ContextDescriptorFlags
    mangledName: NativePointer
    fieldDescriptor: NativePointer
    numberOfFields: number
    offsetToTheFieldOffsetVector: number
    genericContextHeader: TargetTypeGenericContextDescriptorHeader
}

export abstract class TypeDescriptor {
    readonly ptr: NativePointer

    constructor(ptr: NativePointer) {
        this.ptr = ptr;
    }
}