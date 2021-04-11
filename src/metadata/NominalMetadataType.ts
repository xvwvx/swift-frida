import {MetadataType} from "./MetadataType";
import {NominalMetadataLayoutType} from "../layout/MetadataLayoutType";
import {TypeDescriptor} from "../layout/TypeDescriptor";
import {FieldDescriptor} from "../layout/FieldDescriptor";
import {PropertyInfo} from "../model/PropertyInfo";

export class NominalMetadataType<Layout extends NominalMetadataLayoutType<TypeDescriptor>>
    extends MetadataType<Layout> {
    genericArgumentOffset = 2

    get isGeneric(): boolean {
        return this.layout.typeDescriptor.flags.isGeneric
    }

    get mangledName(): string {
        return this.layout.typeDescriptor.mangledName.readUtf8String()!
    }

    get numberOfFields(): number {
        return this.layout.typeDescriptor.numberOfFields
    }

    fieldOffsets(): number[] {
        let offset = this.layout.typeDescriptor.offsetToTheFieldOffsetVector
        let ptr = this.ptr.add(offset * Process.pointerSize)
        return Array.from({length: this.numberOfFields})
            .map((_, i) => {
                return ptr.add(4 * i).readU32()
            })
    }

    properties(): PropertyInfo[] {
        let offsets = this.fieldOffsets()
        let fieldDescriptor = new FieldDescriptor(this.layout.typeDescriptor.fieldDescriptor)
        let genericVector = this.genericArgumentVector()

        return Array.from({length: this.numberOfFields})
            .map((_, i) => {
                let record = fieldDescriptor.getNumField(i)
                return new PropertyInfo(
                    record.fieldName,
                    record.type(
                        this.layout.typeDescriptor.ptr,
                        genericVector,
                    ),
                    record.isVar, offsets[i],
                    this.type)
            })
    }

    genericArguments(): NativePointer[] {
        if (!this.isGeneric) {
            return []
        }

        let count = this.layout.typeDescriptor
            .genericContextHeader
            .base
            .numberOfParams
        let ptr = this.genericArgumentVector()
        return Array.from({length: count})
            .map((_, i) => {
                return new NativePointer(ptr.add(Process.pointerSize * i).readULong())
            })
    }

    genericArgumentVector(): NativePointer {
        return this.ptr.add(this.genericArgumentOffset * Process.pointerSize)
    }
}