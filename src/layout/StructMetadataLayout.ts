import {NominalMetadataLayoutType} from "./MetadataLayoutType";
import {StructTypeDescriptor} from "./StructTypeDescriptor";
import {MetadataKind, toMetadataKind} from "../model/MetadataKind";

export class StructMetadataLayout implements NominalMetadataLayoutType<StructTypeDescriptor> {
    readonly kind: MetadataKind
    readonly typeDescriptor: StructTypeDescriptor

    constructor(ptr: NativePointer) {
        this.kind = toMetadataKind(ptr)
        let typeDescriptorPtr = new NativePointer(ptr.add(Process.pointerSize).readLong())
        this.typeDescriptor = new StructTypeDescriptor(typeDescriptorPtr)
    }
}