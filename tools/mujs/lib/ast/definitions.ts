// Copyright 2016 Marapongo, Inc. All rights reserved.

import * as symbols from "../symbols";
import {Identifier, Node} from "./nodes";
import * as statements from "./statements";

// TODO(joe): consider refactoring modifiers from booleans to enums.

/* Definitions */

// A definition is something that possibly exported for external usage.
export interface Definition extends Node {
    name:         Identifier; // a required name, unique amongst definitions with a common parent.
    description?: string;     // an optional informative description.
}

/* Modules */

// A module contains members, including variables, functions, and/or classes.
export interface Module extends Definition {
    kind:    ModuleKind;
    members: ModuleMembers;
}
export const moduleKind = "Module";
export type  ModuleKind = "Module";
export type  Modules = { [token: string /*symbols.Token*/]: Definition };

// A module member is a definition that belongs to a module.
export interface ModuleMember extends Definition {
    access?: symbols.Accessibility;
}
export type ModuleMembers = { [token: string /*symbols.ModuleToken*/]: ModuleMember };

/* Classes */

// An export definition re-exports a definition from another module, possibly with a different name.
export interface Export extends ModuleMember {
    kind:  ExportKind;
    token: symbols.Token;
}
export const exportKind = "Export";
export type  ExportKind = "Export";

// A class can be constructed to create an object, and exports properties, methods, and has a number of attributes.
export interface Class extends ModuleMember {
    kind:        ClassKind;
    extends?:    symbols.TypeToken;
    implements?: symbols.TypeToken[];
    sealed?:     boolean;
    abstract?:   boolean;
    record?:     boolean;
    interface?:  boolean;
    members?:    ClassMembers;
}
export const classKind = "Class";
export type  ClassKind = "Class";

// A class member is a definition that belongs to a class.
export interface ClassMember extends Definition {
    access?: symbols.ClassMemberAccessibility;
    static?: boolean;
}
export type ClassMembers = { [token: string /*symbols.TypeToken*/]: ClassMember };

/* Variables */

// A variable is a typed storage location.
export interface Variable extends Definition {
    type?:     symbols.TypeToken;
    default?:  any; // a trivially serializable default value.
    readonly?: boolean;
}

// A variable that is lexically scoped within a function (either a parameter or local).
export interface LocalVariable extends Variable {
    kind: LocalVariableKind;
}
export const localVariableKind = "LocalVariable";
export type  LocalVariableKind = "LocalVariable";

// A module property is like a variable but belongs to a module.
export interface ModuleProperty extends Variable, ModuleMember {
    kind: ModulePropertyKind;
}
export const modulePropertyKind = "ModuleProperty";
export type  ModulePropertyKind = "ModuleProperty";

// A class property is just like a module property with some extra attributes.
export interface ClassProperty extends Variable, ClassMember {
    kind:     ClassPropertyKind;
    primary?: boolean;
}
export const classPropertyKind = "ClassProperty";
export type  ClassPropertyKind = "ClassProperty";

/* Functions */

// A function is an executable bit of code: a class function, class method, or a lambda (see il module).
export interface Function extends Definition {
    parameters?: LocalVariable[];
    returnType?: symbols.TypeToken;
    body?:       statements.Block;
}

// A module method is just a function with an accessibility.
export interface ModuleMethod extends Function, ModuleMember {
    kind: ModuleMethodKind;
}
export const moduleMethodKind = "ModuleMethod";
export type  ModuleMethodKind = "ModuleMethod";

// A class method is just like a module method with some extra attributes.
export interface ClassMethod extends Function, ClassMember {
    kind:      ClassMethodKind;
    sealed?:   boolean;
    abstract?: boolean;
}
export const classMethodKind = "ClassMethod";
export type  ClassMethodKind = "ClassMethod";

/** Helper functions **/

export function isDefinition(node: Node): boolean {
    switch (node.kind) {
        case moduleKind:
        case exportKind:
        case classKind:
        case localVariableKind:
        case modulePropertyKind:
        case classPropertyKind:
        case moduleMethodKind:
        case classMethodKind:
            return true;
        default:
            return false;
    }
}

