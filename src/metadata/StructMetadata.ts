import {NominalMetadataType} from "./NominalMetadataType";
import {StructMetadataLayout} from "../layout/StructMetadataLayout";
import {TypeInfo} from "../model/TypeInfo";

export class StructMetadata extends NominalMetadataType<StructMetadataLayout> {
    constructor(ptr: NativePointer) {
        super(ptr, StructMetadataLayout);
    }

    toTypeInfo(): TypeInfo {
        let info = new TypeInfo(this)
        info.properties = this.properties()
        info.mangledName = this.mangledName
        info.genericTypes = this.genericArguments()
        return info
    }
}