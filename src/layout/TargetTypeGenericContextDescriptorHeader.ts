export class TargetTypeGenericContextDescriptorHeader {
    readonly instantiationCache: number
    readonly defaultInstantiationPattern: number
    readonly base: TargetGenericContextDescriptorHeader

    constructor(ptr: NativePointer) {
        this.instantiationCache = ptr.readS32()
        this.defaultInstantiationPattern = ptr.add(4).readS32()
        this.base = new TargetGenericContextDescriptorHeader(ptr.add(8))
    }
}

export class TargetGenericContextDescriptorHeader {
    readonly numberOfParams: number
    readonly numberOfRequirements: number
    readonly numberOfKeyArguments: number
    readonly numberOfExtraArguments: number

    constructor(ptr: NativePointer) {
        this.numberOfParams = ptr.readU16()
        this.numberOfRequirements = ptr.add(2).readU16()
        this.numberOfKeyArguments = ptr.add(4).readU16()
        this.numberOfExtraArguments = ptr.add(6).readU16()
    }
}