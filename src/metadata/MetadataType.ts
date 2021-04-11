import {MetadataKind} from "../model/MetadataKind";
import {MetadataLayoutType} from "../layout/MetadataLayoutType";
import {ValueWitnessFlags, ValueWitnessTable} from "../layout/ValueWitnessTable";
import {TypeInfoConvertible} from "../model/TypeInfoConvertible";
import {TypeInfo} from "../model/TypeInfo";

interface MetadataInfo {
    readonly kind: MetadataKind
    readonly size: number
    readonly alignment: number
    readonly stride: number
}

export class MetadataType<Layout extends MetadataLayoutType> implements MetadataInfo, TypeInfoConvertible {
    readonly ptr: NativePointer
    readonly layout: Layout

    constructor(ptr: NativePointer, LayoutCreator: new(ptr: NativePointer) => Layout) {
        this.ptr = ptr
        this.layout = new LayoutCreator(ptr)
    }

    get type(): NativePointer {
        return this.ptr
    }

    get kind(): MetadataKind {
        return this.layout.kind
    }

    get alignment(): number {
        return (this.valueWitnessTable.flags & ValueWitnessFlags.alignmentMask) + 1
    }

    get size(): number {
        return this.valueWitnessTable.size
    }

    get stride(): number {
        return this.valueWitnessTable.stride
    }

    private _valueWitnessTable: ValueWitnessTable | null = null
    get valueWitnessTable(): ValueWitnessTable {
        if (this._valueWitnessTable == null) {
            let ptr = new NativePointer(this.ptr.add(-Process.pointerSize).readULong())
            this._valueWitnessTable = new ValueWitnessTable(ptr)
        }
        return this._valueWitnessTable
    }

    toTypeInfo(): TypeInfo {
        return new TypeInfo(this);
    }
}