export class ValueWitnessTable {
    readonly initializeBufferWithCopyOfBuffer: NativePointer
    readonly destroy: NativePointer
    readonly initializeWithCopy: NativePointer
    readonly assignWithCopy: NativePointer
    readonly initializeWithTake: NativePointer
    readonly assignWithTake: NativePointer
    readonly getEnumTagSinglePayload: NativePointer
    readonly storeEnumTagSinglePayload: NativePointer
    readonly size: number
    readonly stride: number
    readonly flags: number

    constructor(ptr: NativePointer) {
        this.initializeBufferWithCopyOfBuffer = new NativePointer(ptr.readULong())
        this.destroy = new NativePointer(ptr.add(Process.pointerSize).readULong())
        this.initializeWithCopy = new NativePointer(ptr.add(Process.pointerSize * 2).readULong())
        this.assignWithCopy = new NativePointer(ptr.add(Process.pointerSize * 3).readULong())
        this.initializeWithTake = new NativePointer(ptr.add(Process.pointerSize * 4).readULong())
        this.assignWithTake = new NativePointer(ptr.add(Process.pointerSize * 5).readULong())
        this.getEnumTagSinglePayload = new NativePointer(ptr.add(Process.pointerSize * 6).readULong())
        this.storeEnumTagSinglePayload = new NativePointer(ptr.add(Process.pointerSize * 7).readULong())
        this.size = ptr.add(Process.pointerSize * 8).readS32()
        this.stride = ptr.add(Process.pointerSize * 9).readS32()
        this.flags = ptr.add(Process.pointerSize * 10).readS32()
    }
}

export enum ValueWitnessFlags {
    alignmentMask = 0x0000FFFF,
    isNonPOD = 0x00010000,
    isNonInline = 0x00020000,
    hasExtraInhabitants = 0x00040000,
    hasSpareBits = 0x00080000,
    isNonBitwiseTakable = 0x00100000,
    hasEnumWitnesses = 0x00200000,
}