export interface Address {
	line1?: string;
	line2?: string;
	city?: string;
	state?: string;
	zip?: string;
}

export interface Channel {
	type: string;
	id: string;
}

export interface Official {
	name: string;
	address?: Address[];
	party?: string;
	phones?: string[];
	urls?: string[];
	photoUrl?: string;
	emails?: string[];
	channels?: Channel[];
}

export interface Office {
	name: string;
	divisionId: string;
	levels?: string[];
	roles?: string[];
	officialIndices: number[];
}

export interface Division {
	name: string;
	officeIndices?: number[];
}

export interface RepresentativesResponse {
	normalizedInput?: Address;
	divisions?: Record<string, Division>;
	offices?: Office[];
	officials?: Official[];
	error?: string;
}

export interface OfficialWithOffice extends Official {
	officeName: string;
	levels?: string[];
	roles?: string[];
}
