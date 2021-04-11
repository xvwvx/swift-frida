interface NativePointer {
    readRelativeVectorPointer(): NativePointer
}

NativePointer.prototype.readRelativeVectorPointer = function (): NativePointer {
    return this.add(this.readS32())
}