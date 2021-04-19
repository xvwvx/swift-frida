import {NominalMetadataType} from "./NominalMetadataType";
import {ClassMetadataLayout} from "../layout/ClassMetadataLayout";

export class AnyClassMetadata {
    constructor(ptr: NativePointer) {
    }
}

export class ClassMetadata extends NominalMetadataType<ClassMetadataLayout> {
    constructor(ptr: NativePointer) {
        super(ptr, ClassMetadataLayout);
    }

    get hasResilientSuperclass(): boolean {
        let typeDescriptor = this.layout.typeDescriptor
        return ((typeDescriptor.flags >> 16) & 0x2000) != 0
    }

    get areImmediateMembersNegative(): boolean {
        let typeDescriptor = this.layout.typeDescriptor
        return ((typeDescriptor.flags >> 16) & 0x1000) != 0
    }

    get genericArgumentOffset(): number {
        let typeDescriptor = this.layout.typeDescriptor
        if (!this.hasResilientSuperclass) {
            return this.areImmediateMembersNegative
                ? -typeDescriptor.negativeSizeAndBoundsUnion.metadataNegativeSizeInWords
                : typeDescriptor.metadataPositiveSizeInWords - typeDescriptor.numImmediateMembers
        }
        throw '"Cannot get the `genericArgumentOffset` for classes with a resilient superclass'
    }
}