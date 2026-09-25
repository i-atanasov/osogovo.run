import React from "react";
import axios from "axios";
import { Pencil } from "lucide-react";
import {
    AdminBibButton,
    AdminBibValue,
    AdminDialog,
    AdminDialogActions,
    AdminDialogBackdrop,
    AdminErrorText,
    AdminFilters,
    AdminIconButton,
    AdminNoteCell,
    AdminStatusText,
    AdminTable,
    AdminTableRow,
    AdminTableWrapper,
    SignOutButton,
} from "./styles";
import { readCachedParticipants, writeCachedParticipants } from "./participantCache";

type AdminParticipant = {
    email: string;
    name: string;
    distance: string;
    gender: string;
    birth: number;
    team?: string | null;
    phone_number?: string | null;
    with_t_shirt: boolean;
    t_shirt_size?: string | null;
    paid: boolean;
    payment_status: string;
    bib?: number | null;
    amount?: number | null;
    currency?: string | null;
    discount_code_used?: string | null;
    created_at: string;
    updated_at: string;
    note?: string | null;
    note_completed: boolean;
    note_updated_by?: string | null;
    note_updated_at?: string | null;
};

type NoteResponse = {
    note: string;
    completed: boolean;
    updated_by: string;
    updated_at: string;
};

type AdminRegistrationForm = {
    email: string;
    name: string;
    distance: '14' | '26';
    gender: 'male' | 'female' | '';
    birth: string;
    team: string;
    phoneNumber: string;
    discountCode: string;
    withTShirt: boolean;
    tShirtSize: string;
    termsAndConditions: boolean;
};

const apiUrl = process.env.REACT_APP_REGISTRATION_API_URL;

const getAgeCategory = (birth: number): 'sub20' | '20-40' | 'over40' => {
    const age = new Date().getFullYear() - birth;
    if (age < 21) return 'sub20';
    if (age > 39) return 'over40';
    return '20-40';
};

const AdminParticipants: React.FC = () => {
    const [participants, setParticipants] = React.useState<AdminParticipant[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [selectedEmail, setSelectedEmail] = React.useState<string | null>(null);
    const [genderFilter, setGenderFilter] = React.useState('');
    const [nameFilter, setNameFilter] = React.useState('');
    const [distanceFilter, setDistanceFilter] = React.useState('');
    const [ageFilter, setAgeFilter] = React.useState('');
    const [paidFilter, setPaidFilter] = React.useState('');
    const [participantForBib, setParticipantForBib] = React.useState<AdminParticipant | null>(null);
    const [bib, setBib] = React.useState('');
    const [bibError, setBibError] = React.useState<string | null>(null);
    const [savingBib, setSavingBib] = React.useState(false);
    const [confirmingBib, setConfirmingBib] = React.useState<number | null>(null);
    const [savingNoteEmail, setSavingNoteEmail] = React.useState<string | null>(null);
    const [savingPaidEmail, setSavingPaidEmail] = React.useState<string | null>(null);
    const [noteErrorEmail, setNoteErrorEmail] = React.useState<string | null>(null);
    const [openNoteEditors, setOpenNoteEditors] = React.useState<Set<string>>(() => new Set());
    const [registrationOpen, setRegistrationOpen] = React.useState(false);
    const [registrationSaving, setRegistrationSaving] = React.useState(false);
    const [registrationError, setRegistrationError] = React.useState<string | null>(null);
    const [registrationForm, setRegistrationForm] = React.useState<AdminRegistrationForm>({
        email: '', name: '', distance: '26', gender: '', birth: '', team: '', phoneNumber: '',
        discountCode: '', withTShirt: false, tShirtSize: '', termsAndConditions: true,
    });

    React.useEffect(() => {
        const cachedParticipants = readCachedParticipants<AdminParticipant>();
        if (cachedParticipants.length > 0) {
            setParticipants(cachedParticipants);
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        const fetchParticipants = async () => {
            if (!apiUrl) {
                setError('Missing API URL configuration');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get<AdminParticipant[]>(`${apiUrl}/admin/participants`, {
                    withCredentials: true,
                });
                setParticipants(response.data);
                writeCachedParticipants(response.data);
            } catch {
                setError('Could not load participant data.');
            } finally {
                setLoading(false);
            }
        };

        fetchParticipants();
    }, []);

    if (loading) {
        return <AdminStatusText>Loading participants...</AdminStatusText>;
    }

    if (error) {
        return <AdminErrorText>{error}</AdminErrorText>;
    }

    const filteredParticipants = participants.filter((participant) => (
        (!nameFilter || participant.name.toLocaleLowerCase('bg-BG').includes(nameFilter.trim().toLocaleLowerCase('bg-BG')))
        && (!genderFilter || participant.gender === genderFilter)
        && (!distanceFilter || participant.distance === distanceFilter)
        && (!ageFilter || getAgeCategory(participant.birth) === ageFilter)
        && (!paidFilter || participant.payment_status === 'paid')
    ));

    const openBibDialog = (participant: AdminParticipant) => {
        setParticipantForBib(participant);
        setBib(participant.bib?.toString() ?? '');
        setBibError(null);
    };

    const closeBibDialog = () => {
        if (!savingBib) {
            setParticipantForBib(null);
            setConfirmingBib(null);
        }
    };

    const submitBib = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const parsedBib = Number(bib);
        if (!Number.isInteger(parsedBib) || parsedBib <= 0) {
            setBibError('Моля, въведете положително цяло число.');
            return;
        }

        if (!apiUrl || !participantForBib) {
            return;
        }

        try {
            setSavingBib(true);
            setBibError(null);
            const response = await axios.get<{ available: boolean }>(`${apiUrl}/admin/participants/bib-availability`, {
                params: { bib: parsedBib, email: participantForBib.email },
                withCredentials: true,
            });

            if (!response.data.available) {
                setBibError('Този стартов номер вече е зает.');
                return;
            }

            setConfirmingBib(parsedBib);
        } catch {
            setBibError('Неуспешна проверка на стартовия номер.');
        } finally {
            setSavingBib(false);
        }
    };

    const confirmBib = async () => {
        if (!apiUrl || !participantForBib || confirmingBib === null) {
            return;
        }

        try {
            setSavingBib(true);
            setBibError(null);
            const response = await axios.patch<{ bib: number }>(
                `${apiUrl}/admin/participants/${encodeURIComponent(participantForBib.email)}`,
                { bib: confirmingBib },
                { withCredentials: true },
            );
            setParticipants((currentParticipants) => currentParticipants.map((participant) => (
                participant.email === participantForBib.email
                    ? { ...participant, bib: response.data.bib }
                    : participant
            )));
            setParticipantForBib(null);
            setConfirmingBib(null);
        } catch (requestError) {
            if (axios.isAxiosError(requestError) && requestError.response?.status === 409) {
                setBibError('Този стартов номер вече е зает.');
            } else {
                setBibError('Неуспешно запазване на стартовия номер.');
            }
        } finally {
            setSavingBib(false);
        }
    };

    const markParticipantPaid = async (participant: AdminParticipant) => {
        if (!apiUrl || savingPaidEmail) return;

        try {
            setSavingPaidEmail(participant.email);
            const response = await axios.patch<{ paid: boolean; payment_status: string; updated_at: string }>(
                `${apiUrl}/admin/participants/${encodeURIComponent(participant.email)}/mark-paid`,
                undefined,
                { withCredentials: true },
            );
            setParticipants((currentParticipants) => {
                const updated = currentParticipants.map((currentParticipant) => (
                    currentParticipant.email === participant.email
                        ? { ...currentParticipant, paid: response.data.paid, payment_status: response.data.payment_status, updated_at: response.data.updated_at }
                        : currentParticipant
                ));
                writeCachedParticipants(updated);
                return updated;
            });
        } catch {
            setError('Неуспешно отбелязване на плащането.');
        } finally {
            setSavingPaidEmail(null);
        }
    };

    const updateNoteText = (email: string, note: string) => {
        setParticipants((currentParticipants) => currentParticipants.map((participant) => (
            participant.email === email ? { ...participant, note } : participant
        )));
    };

    const openNoteEditor = (email: string) => {
        setOpenNoteEditors((currentEditors) => new Set(currentEditors).add(email));
    };

    const saveNote = async (participant: AdminParticipant, completed = participant.note_completed) => {
        if (!apiUrl || savingNoteEmail) {
            return;
        }

        try {
            setSavingNoteEmail(participant.email);
            setNoteErrorEmail(null);
            const response = await axios.patch<NoteResponse>(
                `${apiUrl}/admin/participants/${encodeURIComponent(participant.email)}/note`,
                { note: participant.note ?? '', completed },
                { withCredentials: true },
            );
            setParticipants((currentParticipants) => currentParticipants.map((currentParticipant) => (
                currentParticipant.email === participant.email
                    ? {
                        ...currentParticipant,
                        note: response.data.note,
                        note_completed: response.data.completed,
                        note_updated_by: response.data.updated_by,
                        note_updated_at: response.data.updated_at,
                    }
                    : currentParticipant
            )));
            if (!response.data.note.trim()) {
                setOpenNoteEditors((currentEditors) => {
                    const nextEditors = new Set(currentEditors);
                    nextEditors.delete(participant.email);
                    return nextEditors;
                });
            }
        } catch {
            setNoteErrorEmail(participant.email);
        } finally {
            setSavingNoteEmail(null);
        }
    };

    const updateRegistrationField = <K extends keyof AdminRegistrationForm>(field: K, value: AdminRegistrationForm[K]) => {
        setRegistrationForm((current) => ({ ...current, [field]: value }));
    };

    const submitAdminRegistration = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!apiUrl) return;

        try {
            setRegistrationSaving(true);
            setRegistrationError(null);
            const response = await axios.post<AdminParticipant>(`${apiUrl}/admin/participants/register`, {
                ...registrationForm,
                birth: Number(registrationForm.birth),
                paid: true,
            }, { withCredentials: true });
            setParticipants((current) => [response.data, ...current.filter((participant) => participant.email !== response.data.email)]);
            writeCachedParticipants([response.data, ...participants.filter((participant) => participant.email !== response.data.email)]);
            setRegistrationOpen(false);
            setRegistrationForm({ email: '', name: '', distance: '26', gender: '', birth: '', team: '', phoneNumber: '', discountCode: '', withTShirt: false, tShirtSize: '', termsAndConditions: true });
        } catch (requestError) {
            setRegistrationError(axios.isAxiosError(requestError) && typeof requestError.response?.data?.error === 'string'
                ? requestError.response.data.error
                : 'Регистрацията не можа да бъде запазена.');
        } finally {
            setRegistrationSaving(false);
        }
    };

    return (
        <AdminTableWrapper>
            <AdminBibButton type="button" onClick={() => { setRegistrationError(null); setRegistrationOpen(true); }}>
                Регистрирай участник на място
            </AdminBibButton>
            <AdminFilters>
                <label>
                    Име
                    <input
                        onChange={(event) => setNameFilter(event.target.value)}
                        placeholder="Търсене по име"
                        type="search"
                        value={nameFilter}
                    />
                </label>
                <label>
                    Пол
                    <select value={genderFilter} onChange={(event) => setGenderFilter(event.target.value)}>
                        <option value="">Всички</option>
                        <option value="female">Жени</option>
                        <option value="male">Мъже</option>
                    </select>
                </label>
                <label>
                    Дистанция
                    <select value={distanceFilter} onChange={(event) => setDistanceFilter(event.target.value)}>
                        <option value="">Всички</option>
                        <option value="14">14 км</option>
                        <option value="26">26 км</option>
                    </select>
                </label>
                <label>
                    Категория
                    <select value={ageFilter} onChange={(event) => setAgeFilter(event.target.value)}>
                        <option value="">Всички</option>
                        <option value="sub20">До 20</option>
                        <option value="20-40">20-40</option>
                        <option value="over40">Над 40</option>
                    </select>
                </label>
                <label>
                    Плащане
                    <select value={paidFilter} onChange={(event) => setPaidFilter(event.target.value)}>
                        <option value="">Всички</option>
                        <option value="paid">Само платени</option>
                    </select>
                </label>
            </AdminFilters>

            <AdminStatusText>{filteredParticipants.length} участници. Общо платени: {filteredParticipants.filter((participant) => participant.payment_status === 'paid').length}</AdminStatusText>
            <AdminTable>
                <thead>
                    <tr>
                        <th>Стартов номер</th>
                        <th>Име</th>
                        <th>Бележки</th>
                        <th>Имейл</th>
                        <th>Телефон</th>
                        <th>Дистанция</th>
                        <th>Пол</th>
                        <th>Година на раждане</th>
                        <th>Отбор</th>
                        <th>Тениска</th>
                        <th>Плащане</th>
                        <th>Платено</th>
                        <th>Код за отстъпка</th>
                        <th>Регистриран на</th>
                        <th>Последна промяна на</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredParticipants.map((participant) => (
                        <AdminTableRow
                            key={participant.email}
                            selected={selectedEmail === participant.email}
                            tabIndex={0}
                            onClick={() => setSelectedEmail(participant.email)}
                            onKeyDown={(event) => {
                                if (event.target !== event.currentTarget) {
                                    return;
                                }
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    setSelectedEmail(participant.email);
                                }
                            }}
                        >
                            <td>
                                {participant.bib === null || participant.bib === undefined ? (
                                    <AdminBibButton
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            openBibDialog(participant);
                                        }}
                                    >
                                        Дай номер
                                    </AdminBibButton>
                                ) : (
                                    <AdminBibValue>
                                        {participant.bib}
                                        <AdminIconButton
                                            aria-label="Редактирай стартов номер"
                                            title="Редактирай стартов номер"
                                            type="button"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                openBibDialog(participant);
                                            }}
                                        >
                                            <Pencil aria-hidden="true" size={16} />
                                        </AdminIconButton>
                                    </AdminBibValue>
                                )}
                            </td>
                            <td>
                                {participant.name} &nbsp;
                                {!participant.paid && (
                                    <AdminBibButton
                                        type="button"
                                        disabled={savingPaidEmail !== null}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            markParticipantPaid(participant);
                                        }}
                                    >
                                        {savingPaidEmail === participant.email ? 'Запазване...' : 'Отбележи плащане'}
                                    </AdminBibButton>
                                )}
                            </td>
                            <td onClick={(event) => event.stopPropagation()}>
                                {participant.note?.trim() || openNoteEditors.has(participant.email) ? (
                                    <AdminNoteCell>
                                        <textarea
                                            aria-label={`Бележка за ${participant.name}`}
                                            disabled={participant.note_completed}
                                            onChange={(event) => updateNoteText(participant.email, event.target.value)}
                                            placeholder="Бележка"
                                            value={participant.note ?? ''}
                                        />
                                        {participant.note_completed ? (
                                            <AdminBibButton
                                                type="button"
                                                disabled={savingNoteEmail !== null}
                                                onClick={() => saveNote(participant, false)}
                                            >
                                                {savingNoteEmail === participant.email ? 'Запазване...' : 'Добави'}
                                            </AdminBibButton>
                                        ) : (
                                            <>
                                                <AdminBibButton
                                                    type="button"
                                                    disabled={savingNoteEmail !== null}
                                                    onClick={() => saveNote(participant)}
                                                >
                                                    {savingNoteEmail === participant.email ? 'Запазване...' : 'Запази'}
                                                </AdminBibButton>
                                                {participant.note?.trim() && participant.note_updated_at && (
                                                    <AdminBibButton
                                                        type="button"
                                                        disabled={savingNoteEmail !== null}
                                                        onClick={() => saveNote(participant, true)}
                                                    >
                                                        Завърши
                                                    </AdminBibButton>
                                                )}
                                            </>
                                        )}
                                        {noteErrorEmail === participant.email ? (
                                            <small>Бележката не можа да бъде запазена.</small>
                                        ) : participant.note_updated_by && participant.note_updated_at ? (
                                            <small>
                                                {participant.note_updated_by}, {new Date(participant.note_updated_at).toLocaleString()}
                                            </small>
                                        ) : null}
                                    </AdminNoteCell>
                                ) : (
                                    <AdminBibButton
                                        type="button"
                                        onClick={() => openNoteEditor(participant.email)}
                                    >
                                        Добави бележка
                                    </AdminBibButton>
                                )}
                            </td>
                            <td>{participant.email}</td>
                            <td>{participant.phone_number ?? '-'}</td>
                            <td>{participant.distance} km</td>
                            <td>{participant.gender}</td>
                            <td>{participant.birth}</td>
                            <td>{participant.team ?? '-'}</td>
                            <td>{participant.with_t_shirt ? participant.t_shirt_size ?? 'Yes' : 'No'}</td>
                            <td>{participant.payment_status}</td>
                            <td>{participant.amount !== null && participant.amount !== undefined ? `${participant.amount/100} ${participant.currency ?? ''}`.trim() : '-'}</td>
                            <td>{participant.discount_code_used ?? '-'}</td>
                            <td>{new Date(participant.created_at).toLocaleString()}</td>
                            <td>{new Date(participant.updated_at).toLocaleString()}</td>
                        </AdminTableRow>
                    ))}
                </tbody>
            </AdminTable>
            {participantForBib && (
                <AdminDialogBackdrop onMouseDown={closeBibDialog}>
                    <AdminDialog onSubmit={submitBib} onMouseDown={(event) => event.stopPropagation()}>
                        <h2>Стартов номер</h2>
                        <p>{participantForBib.name}</p>
                        <label>
                            Номер
                            <input
                                autoFocus
                                inputMode="numeric"
                                onChange={(event) => setBib(event.target.value)}
                                required
                                step="1"
                                type="number"
                                value={bib}
                            />
                        </label>
                        {bibError && <AdminErrorText>{bibError}</AdminErrorText>}
                        <AdminDialogActions>
                            <AdminBibButton type="button" onClick={closeBibDialog} disabled={savingBib}>
                                Отказ
                            </AdminBibButton>
                            <SignOutButton type="submit" disabled={savingBib}>
                                {savingBib ? 'Запазване...' : 'Запази'}
                            </SignOutButton>
                        </AdminDialogActions>
                    </AdminDialog>
                    {confirmingBib !== null && (
                        <AdminDialogBackdrop onMouseDown={() => !savingBib && setConfirmingBib(null)}>
                            <AdminDialog onSubmit={(event) => {
                                event.preventDefault();
                                confirmBib();
                            }} onMouseDown={(event) => event.stopPropagation()}>
                                <h2>Потвърждение</h2>
                                <p>Сигурни ли сте, че искате да запазите номер {confirmingBib} за {participantForBib.name}?</p>
                                <AdminDialogActions>
                                    <AdminBibButton
                                        type="button"
                                        onClick={() => setConfirmingBib(null)}
                                        disabled={savingBib}
                                    >
                                        Отказ
                                    </AdminBibButton>
                                    <SignOutButton type="submit" disabled={savingBib}>
                                        {savingBib ? 'Запазване...' : 'Потвърди'}
                                    </SignOutButton>
                                </AdminDialogActions>
                            </AdminDialog>
                        </AdminDialogBackdrop>
                    )}
                </AdminDialogBackdrop>
            )}
            {registrationOpen && (
                <AdminDialogBackdrop
                    onMouseDown={() => !registrationSaving && setRegistrationOpen(false)}
                    style={{ alignItems: 'start', justifyItems: 'center', padding: '88px 32px 24px' }}
                >
                    <AdminDialog
                        onSubmit={submitAdminRegistration}
                        onMouseDown={(event) => event.stopPropagation()}
                        style={{ maxHeight: 'calc(100vh - 112px)', overflowY: 'auto' }}
                    >
                        <h2>Регистрация на място</h2>
                        <label>Дистанция<select value={registrationForm.distance} onChange={(event) => updateRegistrationField('distance', event.target.value as '14' | '26')}><option value="14">14 км</option><option value="26">26 км</option></select></label>
                        <label>Имейл<input required type="email" value={registrationForm.email} onChange={(event) => updateRegistrationField('email', event.target.value)} /></label>
                        <label>Имена<input required value={registrationForm.name} onChange={(event) => updateRegistrationField('name', event.target.value)} /></label>
                        <label>Пол<select required value={registrationForm.gender} onChange={(event) => updateRegistrationField('gender', event.target.value as 'male' | 'female')}><option value="">Избери</option><option value="female">Жена</option><option value="male">Мъж</option></select></label>
                        <label>Година на раждане<input required type="number" value={registrationForm.birth} onChange={(event) => updateRegistrationField('birth', event.target.value)} /></label>
                        <label>Телефон<input value={registrationForm.phoneNumber} onChange={(event) => updateRegistrationField('phoneNumber', event.target.value)} /></label>
                        <label>Отбор<input value={registrationForm.team} onChange={(event) => updateRegistrationField('team', event.target.value)} /></label>
                        <label><input required type="checkbox" checked={registrationForm.termsAndConditions} onChange={(event) => updateRegistrationField('termsAndConditions', event.target.checked)} /> Съгласие с условията</label>
                        {registrationError && <AdminErrorText>{registrationError}</AdminErrorText>}
                        <AdminDialogActions><AdminBibButton type="button" disabled={registrationSaving} onClick={() => setRegistrationOpen(false)}>Отказ</AdminBibButton><SignOutButton type="submit" disabled={registrationSaving}>{registrationSaving ? 'Запазване...' : 'Потвърди платена регистрация'}</SignOutButton></AdminDialogActions>
                    </AdminDialog>
                </AdminDialogBackdrop>
            )}
        </AdminTableWrapper>
    );
};

export default AdminParticipants;
