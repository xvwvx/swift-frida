import {NominalMetadataLayoutType} from "./MetadataLayoutType";
import {ClassTypeDescriptor} from "./ClassTypeDescriptor";
import {MetadataKind, toMetadataKind} from "../model/MetadataKind";

export class ClassMetadataLayout implements NominalMetadataLayoutType<ClassTypeDescriptor> {
    readonly kind: MetadataKind
    readonly superClass: NativePointer
    readonly objCRuntimeReserve: Int64[]
    readonly rodataPointer: Int64
    readonly classFlags: number
    readonly instanceAddressPoint: number
    readonly instanceSize: number
    readonly instanceAlignmentMask: number
    readonly reserved: number
    readonly classSize: number
    readonly classAddressPoint: number
    readonly typeDescriptor: ClassTypeDescriptor
    readonly iVarDestroyer: NativePointer

    constructor(ptr: NativePointer) {
        this.kind = toMetadataKind(ptr)
        this.superClass = ptr.add(8)
        this.objCRuntimeReserve = [
            ptr.add(8 * 2).readLong() as Int64,
            ptr.add(8 * 3).readLong() as Int64
        ]
        this.rodataPointer = ptr.add(8 * 4).readLong() as Int64
        this.classFlags = ptr.add(8 * 5).readS32()
        this.instanceAddressPoint = ptr.add(8 * 5 + 4).readU32()
        this.instanceSize = ptr.add(8 * 5 + 4 * 2).readU32()
        this.instanceAlignmentMask = ptr.add(8 * 5 + 4 * 3).readU16()
        this.reserved = ptr.add(8 * 5 + 4 * 3 + 2).readU16()
        this.classSize = ptr.add(8 * 5 + 4 * 3 + 2 * 2).readU32()
        this.classAddressPoint = ptr.add(8 * 5 + 4 * 3 + 2 * 2 + 4).readU32()

        let typeDescriptorPtr = new NativePointer(ptr.add(8 * 5 + 4 * 3 + 2 * 2 + 4 * 2).readLong())
        this.typeDescriptor = new ClassTypeDescriptor(typeDescriptorPtr)
        this.iVarDestroyer = ptr.add(8 * 5 + 4 * 3 + 2 * 2 + 4 * 2 + 8)
    }
}