import "../extensions"
import {TargetTypeGenericContextDescriptorHeader} from "./TargetTypeGenericContextDescriptorHeader";
import {TypeDescriptor} from "./TypeDescriptor";

export class StructTypeDescriptor extends TypeDescriptor {
    readonly flags: number;
    readonly parent: number
    readonly mangledName: NativePointer;
    readonly accessFunctionPtr: NativePointer
    readonly fieldDescriptor: NativePointer;
    readonly numberOfFields: number
    readonly offsetToTheFieldOffsetVector: number;
    readonly genericContextHeader: TargetTypeGenericContextDescriptorHeader;

    constructor(ptr: NativePointer) {
        super(ptr)
        this.flags = ptr.readU32()
        this.parent = ptr.readS32()
        this.mangledName = ptr.add(8).readRelativeVectorPointer()
        this.accessFunctionPtr = ptr.add(12).readRelativeVectorPointer()
        this.fieldDescriptor = ptr.add(16).readRelativeVectorPointer()
        this.numberOfFields = ptr.add(20).readS32()
        this.offsetToTheFieldOffsetVector = ptr.add(24).readS32()
        this.genericContextHeader = new TargetTypeGenericContextDescriptorHeader(ptr.add(28))
    }
}