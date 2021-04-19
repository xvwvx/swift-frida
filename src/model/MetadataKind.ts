let MetadataKindIsRuntimePrivate = 0x100
let MetadataKindIsNonHeap = 0x200
let MetadataKindIsNonType = 0x400

export enum MetadataKind {
    Class = 0,
    Struct = 0 | MetadataKindIsNonHeap,
    Enum = 1 | MetadataKindIsNonHeap,
    Optional = 2 | MetadataKindIsNonHeap,
    ForeignClass = 3 | MetadataKindIsNonHeap,
    Opaque = 0 | MetadataKindIsRuntimePrivate | MetadataKindIsNonHeap,
    Tuple = 1 | MetadataKindIsRuntimePrivate | MetadataKindIsNonHeap,
    Function = 2 | MetadataKindIsRuntimePrivate | MetadataKindIsNonHeap,
    Existential = 3 | MetadataKindIsRuntimePrivate | MetadataKindIsNonHeap,
    Metatype = 4 | MetadataKindIsRuntimePrivate | MetadataKindIsNonHeap,
    ObjCClassWrapper = 5 | MetadataKindIsRuntimePrivate | MetadataKindIsNonHeap,
    ExistentialMetatype = 6 | MetadataKindIsRuntimePrivate | MetadataKindIsNonHeap,
    HeapLocalVariable = 0 | MetadataKindIsNonType,
    HeapGenericLocalVariable = 0 | MetadataKindIsNonType | MetadataKindIsRuntimePrivate,
    ErrorObject = 1 | MetadataKindIsNonType | MetadataKindIsRuntimePrivate,
    Task = 2 | MetadataKindIsNonType | MetadataKindIsRuntimePrivate,
    Job = 3 | MetadataKindIsNonType | MetadataKindIsRuntimePrivate,
    LastEnumerated = 0x7FF,
}

export function toMetadataKind(ptr: NativePointer): MetadataKind {
    let kind: MetadataKind = (ptr.readLong() as Int64).toNumber()
    if (MetadataKind[kind] === undefined) {
        return MetadataKind.Class
    }
    return kind
}