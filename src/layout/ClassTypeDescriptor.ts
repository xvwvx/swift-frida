import {ContextDescriptorFlags, TypeDescriptor} from "./TypeDescriptor";
import {TargetTypeGenericContextDescriptorHeader} from "./TargetTypeGenericContextDescriptorHeader";


export class ClassTypeDescriptor extends TypeDescriptor {
    readonly flags: ContextDescriptorFlags;
    readonly parent: number
    readonly mangledName: NativePointer;
    readonly fieldTypesAccessor: NativePointer
    readonly fieldDescriptor: NativePointer
    readonly superClass: NativePointer
    readonly negativeSizeAndBoundsUnion: NegativeSizeAndBoundsUnion
    readonly metadataPositiveSizeInWords: number
    readonly numImmediateMembers: number
    readonly numberOfFields: number
    readonly offsetToTheFieldOffsetVector: number
    readonly genericContextHeader: TargetTypeGenericContextDescriptorHeader

    constructor(ptr: NativePointer) {
        super(ptr)
        this.flags = new ContextDescriptorFlags(ptr.readU32())
        this.parent = ptr.add(4).readS32()
        this.mangledName = ptr.add(8).readRelativeVectorPointer()
        this.fieldTypesAccessor = ptr.add(12).readRelativeVectorPointer()
        this.fieldDescriptor = ptr.add(16).readRelativeVectorPointer()
        this.superClass = ptr.add(20).readRelativeVectorPointer()
        this.negativeSizeAndBoundsUnion = new NegativeSizeAndBoundsUnion(ptr.add(24))
        this.metadataPositiveSizeInWords = ptr.add(28).readS32()
        this.numImmediateMembers = ptr.add(32).readS32()
        this.numberOfFields = ptr.add(36).readS32()
        this.offsetToTheFieldOffsetVector = ptr.add(40).readS32()
        this.genericContextHeader = new TargetTypeGenericContextDescriptorHeader(ptr.add(44))
    }
}


export class NegativeSizeAndBoundsUnion {
    readonly ptr: NativePointer

    constructor(ptr: NativePointer) {
        this.ptr = ptr
    }

    get metadataNegativeSizeInWords(): number {
        return this.ptr.readS32()
    }

    get resilientMetadataBounds(): TargetStoredClassMetadataBounds {
        return new TargetStoredClassMetadataBounds(this.ptr.readRelativeVectorPointer())
    }
}

class TargetStoredClassMetadataBounds {
    readonly immediateMembersOffset: number
    readonly bounds: TargetMetadataBounds

    constructor(ptr: NativePointer) {
        this.immediateMembersOffset = ptr.readInt()
        this.bounds = new TargetMetadataBounds(ptr.add(Process.pointerSize))
    }
}

class TargetMetadataBounds {
    readonly negativeSizeWords: number
    readonly positiveSizeWords: number

    constructor(ptr: NativePointer) {
        this.negativeSizeWords = ptr.readU32()
        this.positiveSizeWords = ptr.readU32()
    }
}