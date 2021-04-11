export let size_t = Process.pointerSize === 8 ? 'uint64' : Process.pointerSize === 4 ? 'uint32' : "unsupported platform"

interface Internal {
    [key: string]: NativeFunction
}

class Internal implements Internal {
    private static _instance: Internal

    public static get Instance() {
        return this._instance || (this._instance = new this())
    }

    private constructor() {
        let hookFunctions = [
            {
                module: "libswiftCore.dylib",
                functions: {
                    "swift_demangle": ["pointer", ["pointer", size_t, "pointer", "pointer", 'int32']],
                    "swift_getTypeByMangledNameInContext": ["pointer", ["pointer", size_t, "pointer", "pointer"]],
                    "swift_allocObject": ["pointer", ["pointer", size_t, size_t]],
                }
            },
            {
                module: "libsystem_malloc.dylib",
                functions: {
                    "free": ["void", ["pointer"]],
                }
            },
            {
                module: "libmacho.dylib",
                functions: {
                    "getsectiondata": ["pointer", ["pointer", "pointer", "pointer", "pointer",]],
                }
            }
        ]

        for (let hookFunction of hookFunctions) {
            Object.keys(hookFunction.functions)
                .forEach((name) => {
                    const ptr = Module.getExportByName(hookFunction.module, name)
                    const params = hookFunction.functions[name]
                    this[name] = new NativeFunction(ptr, params[0], params[1])
                })
        }
    }
}

export function free(ptr: NativePointer) {
    Internal.Instance.free(ptr)
}

export function swift_demangle_ptr(namePtr: NativePointer, nameLength: number): string | null {
    let demangled = Internal.Instance.swift_demangle(namePtr, nameLength, ptr(0), ptr(0), 0) as NativePointer
    let res: string | null = null
    if (demangled) {
        res = demangled.readUtf8String()
        free(demangled)
    }

    return res
}

export function swift_demangle(name: string) {
    let fixname = name
    if (fixname.startsWith("$s") || fixname.startsWith("_T")) {
        fixname = fixname
    } else if (fixname.startsWith("So")) {
        fixname = "$s" + fixname
    } else {
        fixname = "$s" + fixname
    }


    let cStr = Memory.allocUtf8String(fixname)
    let res = swift_demangle_ptr(cStr, fixname.length)
    if (res && res != fixname) {
        return res
    }
    return name // original string
}

export function swift_getTypeByMangledNameInContext(
    typeNamePtr: NativePointer,
    typeNameLength: number,
    context: NativeArgumentValue,
    genericArgs: NativeArgumentValue): NativePointer {
    return Internal.Instance.swift_getTypeByMangledNameInContext(
        typeNamePtr,
        typeNameLength,
        context,
        genericArgs
    ) as NativePointer
}

export function swift_allocObject(type: string, requiredSize: number, requiredAlignmentMask: number): NativePointer {
    let cStr = Memory.allocUtf8String(type)
    return Internal.Instance.swift_allocObject(
        cStr,
        requiredSize,
        requiredAlignmentMask
    ) as NativePointer
}

export function getSectionData(module: Module, sect: string, seg: string): [NativePointer, number | UInt64] {
    const segName = Memory.allocUtf8String(seg)
    const sectName = Memory.allocUtf8String(sect)
    let sizeAlloc = Memory.alloc(8)

    let ptrSection = Internal.Instance.getsectiondata(
        module.base,
        segName,
        sectName,
        sizeAlloc
    ) as NativePointer

    let sectionSize = sizeAlloc.readULong()
    // [string, number]
    return [ptrSection, sectionSize]
}