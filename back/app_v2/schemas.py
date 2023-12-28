from pydantic import BaseModel
from datetime import date, datetime
from typing import List, Any, Union

# User

class User(BaseModel):
    id: int
    role: int
    email: str

    class Config:
        from_attributes = True

class UserAuth(BaseModel):
    email: str
    password: str

class UserActivateAccount(BaseModel):
    id: int
    code: str

class UserForgotPassword(BaseModel):
    email: str

class UserResetPassword(BaseModel):
    id: int
    code: str
    password: str

# Borrower

class BorrowerBase(BaseModel):
    inn: str

class BorrowerCreate(BorrowerBase):
    name: str | None = None

class BorrowerRating(BaseModel):
    # borrower_id: int
    agency: str
    value: str | None = None

    class Config:
        from_attributes = True

class BorrowerRatingCreate(BorrowerRating):
    borrower_id: int

class Borrower(BorrowerBase):
    id: int
    name: str | None = ""
    sector: str | None = None
    ratings: List[BorrowerRating] = []

    class Config:
        from_attributes = True

class BorrowerRatingHistory(BaseModel):
    id: int
    agency: str
    date: datetime | None = None
    value: str | None = None
    forecast: str | None = None
    prev: dict | None = None
    # prev_value: str | None = None
    # prev_forecast: str | None = None
    borrower: Borrower | None = None

    class Config:
        from_attributes = True

class BorrowerFull(Borrower):
    ratings_history: dict[str, list] = {}


class BorrowerFiltersRequest(BaseModel):
    acra: List[str] | None = []
    raexpert: List[str] | None = []
    nkr: List[str] | None = []
    nra: List[str] | None = []
    search: str | None = None
    loose: bool | None = True

class BorrowerFiltersResponse(BaseModel):
    ratings: dict[str,List] | None = {}
    # forecasts: List[str] | None

# Bond

class BondBase(BaseModel):
    isin: str | None = None

class BondCreate(BondBase):
    name: str | None = None
    borrower_id: int | None = None

class BondRating(BaseModel):
    agency: str
    value: str | None = None

    class Config:
        from_attributes = True

class BondRatingCreate(BondRating):
    bond_id: int

class BondCompositeRatingCreate(BaseModel):
    bond_id: int | None = None
    borrower_id: int | None = None
    agency: str
    bond_value: str | None = None
    bond_forecast: str | None = None
    borrower_value: str | None = None
    borrower_forecast: str | None = None

    class Config:
        from_attributes = True

class BondCompositeRating(BaseModel):
    agency: str
    value: str | None = None
    forecast: str | None = None

    class Config:
        from_attributes = True

class Bond(BaseModel):
    id: int
    isin: str | None = None
    name: str | None = None
    short: str | None = None
    status: str | None = None
    dist_date_start: date | None = None
    dist_date_end: date | None = None
    # securities | 1/d
    maturity_date: date | None = None
    offer_date: date | None = None
    closest_date: date | None = None
    coupon_date: date | None = None
    coupon_percent: float | None = None
    coupon_value: float | None = None
    coupon_period: int | None = None
    coupons_per_year: float | None = None
    buyback_date: date | None = None
    buyback_price: float | None = None
    nkd: float | None = None
    dolg: float | None = None
    board_id: str | None = None
    market_code: str | None = None
    instr_id: str | None = None
    currency: str | None = None
    currency_support: str | None = None
    issue_size: int | None = None
    issue_size_placed: int | None = None
    listing_level: int | None = None
    bond_type: str | None = None
    lot_size: int | None = None
    lot_value: int | None = None
    # marketdata | 1/d
    duration: int | None = None
    liquidity_month_qty: int | None = None
    liquidity_month_sum: int | None = None
    liquidity_week_qty: int | None = None
    liquidity_week_sum: int | None = None
    liquidity_day_qty: int | None = None
    liquidity_day_sum: int | None = None
    # marketdata | permanent
    yields: float | None = None
    last_price: float | None = None
    spread: float | None = None
    price_med: float | None = None
    spike: float | None = None
    spike_prcnt: float | None = None
    coupon_percent_relative: float | None = None
    #
    bonus: float | None = None
    bonus_dur: float | None = None
    #
    # borrower: Borrower | None = None
    ratings: List[BondCompositeRating] | None = []

    class Config:
        from_attributes = True


# class BondFiltersRequest(BaseModel):
#     acra: List[str] | None = []
#     raexpert: List[str] | None = []
#     nkr: List[str] | None = []
#     nra: List[str] | None = []
#     search: str | None = None
#     loose: bool | None = True
#     status: List[str] | None = []

class BondFiltersResponse(BaseModel):
    ratings: dict[str,List] | None = {}
    statuses: list[str] | None = []
    # forecasts: List[str] | None

class UpcomingBond(BaseModel):
    id: int
    name: str | None = None
    isin: str | None = None
    status: str | None = None
    dist_date_start: date | None = None
    maturity_date: date | None = None
    ratings: List[BorrowerRating] = []
    total_sum: int | None = None

# Folder

class FolderCreate(BaseModel):
    name: str
    public: bool = False

class Folder(BaseModel):
    id: int
    name: str
    bonds_ids: List[Any] | None = []
    public: bool = False

    class Config:
        from_attributes = True

class FolderWithUser(Folder):
    user: User | None = None

class FolderBond(BaseModel):
    bond_id: int

class FoldersList(BaseModel):
    folders: List[int]

#

class TopBondsResult(BaseModel):
    folder: Folder
    bonds: List[Bond]

# RaExpertCache

class RaExpertCache(BaseModel):
    bond_id: int | None = None
    borrower_id: int | None = None

class RaExpertCacheCreate(RaExpertCache):
    link: str | None = None

# Gcurve

class GcurveCreate(BaseModel):
    period: str

class Gcurve(GcurveCreate):
    value: str

class GcurveRepr(BaseModel):
    period: float
    value: float

class GcurveHistory(BaseModel):
    date: date
    data: dict[str,dict]

#################################

class FeatureCreate(BaseModel):
    text: str = ""

class Feature(BaseModel):
    id: int
    created_at: datetime
    text: str = ""


#################################

class FeedbackCreate(BaseModel):
    user_id: int
    label: str | None = None
    message: str | None = None

class Feedback(FeedbackCreate):
    created_at: datetime
    user: User

#################################

class ChatMessage(BaseModel):
    id: int
    chat_id: int
    user_id: int
    created: datetime
    message: str

class Chat(BaseModel):
    id: int
    unread_owner: bool = False
    unread_admin: bool = False
    user: User
    last_message: ChatMessage | None

class ChatNewMessage(BaseModel):
    message: str

#################################

class CountedResult(BaseModel):
    page: int
    total: int

class BondsCountedResult(CountedResult):
    results: List[Bond]

class UpcomingBondsCountedResult(CountedResult):
    results: List[UpcomingBond]

class BorrowersCountedResult(CountedResult):
    results: List[Borrower]

class BorrowersHistoryCountedResult(CountedResult):
    results: List[BorrowerRatingHistory]

class FeedbackCountedResult(CountedResult):
    results: List[Feedback]

#################################

class LoginReponse(BaseModel):
    access_token: str = ""
    refresh_token: str = ""
    user: User

class JWTSettings(BaseModel):
    authjwt_secret_key: str = "grampus7415001"
    # authjwt_access_token_expires: int = 5