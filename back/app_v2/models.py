from __future__ import annotations

import traceback
import asyncio
from datetime import date, datetime
from email.policy import default
from sqlalchemy import func, select, exists, or_, and_
from sqlalchemy import Boolean, Table, Column, BigInteger, Float, String, Text, Date, DateTime, Computed, JSON, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.orm import Mapped
from typing import List
from app_v2.db import Base, SessionFront


class User(Base):
    __tablename__ = "users"

    id: Mapped[int]                               = Column("id", BigInteger, primary_key=True)
    email: Mapped[str]                            = Column("email", String(250), unique=True, index=True)
    hashed_password: Mapped[str]                  = Column("hashed_password", String(250))
    activation_code: Mapped[str | None]           = Column("activation_code", String(6), nullable=True)
    is_active: Mapped[bool]                       = Column("is_active", Boolean, default=False)
    role: Mapped[int]                             = Column("role", BigInteger, default=1)

    # folders: Mapped[ List[Folder] ] = relationship( foreign_keys=id, remote_side="Folder.user_id" )
    folders: Mapped[ List[Folder] ] = relationship(
        "Folder",
        foreign_keys=id,
        remote_side="Folder.user_id",
        primaryjoin="foreign(Folder.user_id) == User.id",
    )

#

class Borrower(Base):
    __tablename__ = "borrowers"

    id: Mapped[int]                               = Column("id", BigInteger, primary_key=True)
    inn: Mapped[str]                              = Column("inn", String(250), unique=True, index=True)
    name: Mapped[str]                             = Column("name", String(250), default="")
    sector: Mapped[str]                           = Column("sector", String(250), default="")

    # bonds: Mapped[ List[Bond] ]             = relationship(
    #     "Bond",
    #     foreign_keys=id,
    #     remote_side="Bond.borrower_id",
    #     primaryjoin="foreign(Bond.borrower_id) == Borrower.id",
    #     back_populates="borrower",
    # )

    ratings: Mapped[ List[BorrowerRating] ] = relationship(
        foreign_keys=id,
        remote_side="BorrowerRating.borrower_id",
        primaryjoin="foreign(BorrowerRating.borrower_id) == Borrower.id",
        lazy="selectin",
    )
    # ratings_history = relationship("BorrowerRatingHistory")

    @property
    def ratings_history(self) -> list[ dict[str, datetime|str] ]:
        ratings = {}
        with SessionFront() as session:
            try:
                statement = \
                    select(BorrowerRatingHistory)\
                    .where(
                        BorrowerRatingHistory.borrower_id==self.id
                    )\
                    .order_by(
                        BorrowerRatingHistory.date.desc()
                    )
                query = session.execute(statement)
                results = query.scalars().all()

                for result in results:
                    if result.agency not in ratings:
                        ratings[result.agency] = []

                    ratings[result.agency].append(
                        {
                            "date": result.date,
                            "value": result.value,
                            "forecast": result.forecast,
                        }
                    )
            except Exception:
                traceback.print_exc()
                pass
            finally:
                session.close()
        return ratings


class BorrowerRating(Base):
    __tablename__ = "borrowers_ratings"

    id: Mapped[int]                               = Column("id", BigInteger, primary_key=True)
    borrower_id: Mapped[int]                      = Column("borrower_id", BigInteger, index=True) # ForeignKey("borrowers.id")
    agency: Mapped[str]                           = Column("agency", String(30), index=True)
    value: Mapped[str]                            = Column("value", String(250), default="")

class BorrowerRatingHistory(Base):
    __tablename__ = "borrowers_ratings_history"
    __table_args__ = ( UniqueConstraint("borrower_id", "date", "agency", name="brh_uniq_idx"), )

    id: Mapped[int]                               = Column("id", BigInteger, primary_key=True)
    borrower_id: Mapped[int]                      = Column("borrower_id", BigInteger, index=True) # ForeignKey("borrowers.id")
    date: Mapped[datetime]                        = Column("date", Date, default=datetime.today)
    agency: Mapped[str]                           = Column("agency", String(42))
    forecast: Mapped[str]                         = Column("forecast", Text, default="")
    value: Mapped[str]                            = Column("value", Text, default="")

    borrower: Mapped[ Borrower ] = relationship(
        "Borrower",
        foreign_keys=borrower_id,
        remote_side="Borrower.id",
        primaryjoin="foreign(BorrowerRatingHistory.borrower_id) == Borrower.id",
        lazy="selectin"
    )

    @property
    def prev(self) -> dict[str,str] | None:
        prev = None
        with SessionFront() as session:
            try:
                statement = \
                    select(BorrowerRatingHistory)\
                    .where(
                        BorrowerRatingHistory.borrower_id == self.borrower_id,
                        BorrowerRatingHistory.agency == self.agency,
                        BorrowerRatingHistory.date < self.date
                    )\
                    .order_by(
                        BorrowerRatingHistory.date.desc()
                    )\
                    .limit(1)
                
                query = session.execute(statement)
                prev = query.scalars().one_or_none()
                if prev:
                    prev = {
                        "id": prev.id,
                        "value": prev.value,
                        "forecast": prev.forecast,
                    }
            except Exception:
                print('='*20)
                print('='*20)
                traceback.print_exc()
                print('='*20)
                print('='*20)
                pass
            finally:
                session.close()
        return prev

#

class BondsInFolders(Base):
    __tablename__ = "bonds_in_folders"
    __table_args__ = ( UniqueConstraint("folder_id", "bond_id", name="fb_uniq_idx"), )

    id: Mapped[int]                               = Column("id", BigInteger, primary_key=True)
    folder_id: Mapped[int]                        = Column("folder_id", BigInteger, index=True) # ForeignKey("borrowers.id")
    bond_id: Mapped[int]                          = Column("bond_id", BigInteger, index=True) # ForeignKey("bonds.id")

#

class Bond(Base):
    __tablename__ = "bonds"
    __table_args__ = ( UniqueConstraint("isin", "board_id", name="isin_board_uniq_idx"), )

    id: Mapped[int]                               = Column("id", BigInteger, primary_key=True)
    isin: Mapped[str]                             = Column("isin", String(250), index=True) # isincode
    name: Mapped[str]                             = Column("name", String(250))
    short: Mapped[str]                            = Column("short", String(250), default="")
    status: Mapped[str]                           = Column("status", String(250), default="")
    dist_date_start: Mapped[datetime | None]      = Column("dist_date_start", Date, nullable=True)
    dist_date_end: Mapped[datetime | None]        = Column("dist_date_end", Date, nullable=True)
    borrower_id: Mapped[int | None]               = Column("borrower_id", BigInteger, nullable=True) # ForeignKey("borrowers.id")
    # securities | 1/d
    maturity_date: Mapped[datetime | None]        = Column("maturity_date", Date, nullable=True) # MATDATE | Дата погашения
    offer_date: Mapped[datetime | None]           = Column("offer_date", Date, nullable=True) # OFFERDATE | Дата Оферты
    closest_date: Mapped[datetime | None]         = Column("closest_date", Date, Computed("CASE WHEN offer_date IS NULL THEN maturity_date ELSE offer_date END",persisted=True)) # offer_date ?? maturity_date
    coupon_date: Mapped[datetime | None]          = Column("coupon_date", Date, nullable=True) # NEXTCOUPON | Дата ближайшего купона
    coupon_percent: Mapped[float | None]          = Column("coupon_percent", Float, nullable=True) # COUPONPERCENT | Ставка купона, %
    coupon_value: Mapped[float | None]            = Column("coupon_value", Float, nullable=True) # COUPONVALUE | Сумма купона, FACEUNIT
    coupon_period: Mapped[int | None]             = Column("coupon_period", BigInteger, nullable=True) # COUPONPERIOD | Длительность купона
    coupons_per_year: Mapped[int | None]          = Column("coupons_per_year", BigInteger, nullable=True) # 365 / COUPONPERIOD
    buyback_date: Mapped[datetime | None]         = Column("buyback_date", Date, nullable=True) # BUYBACKDATE | Дата, к кот.рассч.доходность
    buyback_price: Mapped[float | None]           = Column("buyback_price", Float, nullable=True) # BUYBACKPRICE | Цена оферты, %
    nkd: Mapped[float | None]                     = Column("nkd", Float, nullable=True) # ACCRUEDINT | НКД
    dolg: Mapped[float | None]                    = Column("dolg", Float, nullable=True) # FACEVALUE | Непог.долг
    board_id: Mapped[str | None]                  = Column("board_id", String(12), index=True, nullable=True) # BOARDID | Код режима
    market_code: Mapped[str | None]               = Column("market_code", String(12), nullable=True) # MARKETCODE | Рынок
    instr_id: Mapped[str | None]                  = Column("instr_id", String(12), nullable=True) # INSTRID | Группа инструментов
    currency: Mapped[str | None]                  = Column("currency", String(3), nullable=True) # FACEUNIT | Валюта номинала
    currency_support: Mapped[str | None]          = Column("currency_support", String(3), nullable=True) # CURRENCYID | Сопр. валюта инструмента
    issue_size: Mapped[int | None]                = Column("issue_size", BigInteger, nullable=True) # ISSUESIZE | Объем выпуска, штук
    issue_size_placed: Mapped[int | None]         = Column("issue_size_placed", BigInteger, nullable=True) # ISSUESIZEPLACED | Объем в обращении
    listing_level: Mapped[int | None]             = Column("listing_level", BigInteger, nullable=True) # LISTLEVEL | Уровень листинга
    bond_type: Mapped[str | None]                 = Column("bond_type", String(3), nullable=True) # SECTYPE | Тип ценной бумаги
    lot_size: Mapped[int | None]                  = Column("lot_size", BigInteger, nullable=True) # LOTSIZE | Размер лота
    lot_value: Mapped[int | None]                 = Column("lot_value", BigInteger, nullable=True) # LOTVALUE | Номинал лота
    # marketdata | 1/d
    duration: Mapped[int | None]                  = Column("duration", BigInteger, nullable=True) # DURATION | Дюрация, дней
    liquidity_month_qty: Mapped[int]              = Column("liquidity_month_qty", BigInteger, default=0) # ликвидность / месяц, шт
    liquidity_month_sum: Mapped[int]              = Column("liquidity_month_sum", BigInteger, default=0) # ликвидность / месяц, руб
    liquidity_week_qty: Mapped[int]               = Column("liquidity_week_qty", BigInteger, default=0) # ликвидность / неделя, руб
    liquidity_week_sum: Mapped[int]               = Column("liquidity_week_sum", BigInteger, default=0) # ликвидность / неделя, руб
    liquidity_day_qty: Mapped[int]                = Column("liquidity_day_qty", BigInteger, default=0) # ликвидность / день, руб
    liquidity_day_sum: Mapped[int]                = Column("liquidity_day_sum", BigInteger, default=0) # ликвидность / день, руб
    # marketdata | permanent
    yields: Mapped[float | None]                  = Column("yields", Float, nullable=True) # YIELD | Доходность по последней сделке
    last_price: Mapped[float | None]              = Column("last_price", Float, nullable=True) # VALUE * lot_value | Объем последней сделки, руб.
    spread: Mapped[float | None]                  = Column("spread", Float, nullable=True) # SPREAD | Спрэд торгов
    price_med: Mapped[float | None]               = Column("price_med", Float, nullable=True) # WAPRICE | Средневзвешенная цена, % к номиналу
    spike: Mapped[float | None]                   = Column("spike", Float, nullable=True) # LASTCHANGE | Изменение цены последней сделки к цене последней сделки предыдущего торгового дня
    spike_prcnt: Mapped[float | None]             = Column("spike_prcnt", Float, nullable=True) # LASTCHANGEPRCNT | Изменение цены последней сделки к цене предыдущей сделки, %
    coupon_percent_relative: Mapped[float | None] = Column("coupon_percent_relative", Float, nullable=True) # Текущая купонная доходность | coupon_percent / (last_price + nkd) * 100%
    # 
    bonus: Mapped[float | None]                   = Column("bonus", Float, nullable=True)
    bonus_dur: Mapped[float | None]               = Column("bonus_dur", Float, nullable=True)
    is_moex: Mapped[bool]                         = Column("is_moex", Boolean, default=False)

    # borrower: Mapped[ Borrower ]                 = relationship(
    #     "Borrower",
    #     foreign_keys=borrower_id,
    #     remote_side="Borrower.id",
    #     primaryjoin="foreign(Bond.borrower_id) == Borrower.id",
    #     back_populates="bonds"
    # )
    ratings: Mapped[ List[BondCompositeRating] ] = relationship(
        "BondCompositeRating",
        foreign_keys=id,
        remote_side="BondCompositeRating.bond_id",
        primaryjoin="foreign(BondCompositeRating.bond_id) == Bond.id",
        lazy="selectin"
    )

class BondRating(Base):
    __tablename__ = "bonds_ratings"

    id: Mapped[int]                               = Column("id", BigInteger, primary_key=True)
    bond_id: Mapped[int]                          = Column("bond_id", BigInteger, index=True) # ForeignKey("bonds.id")
    agency: Mapped[str]                           = Column("agency", String(30), index=True)
    value: Mapped[str]                            = Column("value", String(250))

class BondCompositeRating(Base):
    __tablename__ = "bonds_composite_ratings"
    __table_args__ = ( UniqueConstraint("bond_id", "borrower_id", "agency"), )

    id: Mapped[int]                               = Column("id", BigInteger, primary_key=True)
    bond_id: Mapped[int]                          = Column("bond_id", BigInteger, index=True) # ForeignKey("bonds.id")
    borrower_id: Mapped[int | None]               = Column("borrower_id", BigInteger, index=True, nullable=True) # ForeignKey("borrowers.id")
    agency: Mapped[str]                           = Column("agency", String(30), index=True)
    bond_value: Mapped[str | None]                = Column("bond_value", String(250), nullable=True)
    bond_forecast: Mapped[str | None]             = Column("bond_forecast", String(250), nullable=True)
    borrower_value: Mapped[str | None]            = Column("borrower_value", String(250), nullable=True)
    borrower_forecast: Mapped[str | None]         = Column("borrower_forecast", String(250), nullable=True)
    value: Mapped[str | None]                     = Column("value", String(250), Computed("CASE WHEN bond_value IS NULL THEN borrower_value ELSE bond_value END",persisted=True), nullable=True)
    forecast: Mapped[str | None]                  = Column("forecast", String(250), Computed("CASE WHEN bond_forecast IS NULL THEN borrower_forecast ELSE bond_forecast END",persisted=True), nullable=True)

#

class UpcomingBonds(Base):
    __tablename__ = "bonds_upcoming"

    id: Mapped[int]                               = Column("id", BigInteger, primary_key=True)
    isin: Mapped[str | None]                      = Column("isin", String(250), unique=True, index=True, nullable=True)
    name: Mapped[str]                             = Column("name", String(250))
    status: Mapped[str]                           = Column("status", String(250))
    dist_date_start: Mapped[datetime | None]      = Column("dist_date_start", Date, nullable=True)
    maturity_date: Mapped[datetime | None]        = Column("maturity_date", Date, nullable=True)
    borrower_id: Mapped[int]                      = Column("borrower_id", BigInteger, ) # ForeignKey("borrowers.id")
    total_sum: Mapped[int | None]                 = Column("total_sum", BigInteger, nullable=True)

    borrower: Mapped[ Borrower ] = relationship(
        "Borrower",
        foreign_keys=borrower_id,
        remote_side="Borrower.id",
        primaryjoin="foreign(UpcomingBonds.borrower_id) == Borrower.id",
        lazy="selectin"
    )

    @property
    def ratings(self):
        if self.borrower:
            return self.borrower.ratings
        return []

#

class Folder(Base):
    __tablename__ = "folders"

    id: Mapped[int]                               = Column("id", BigInteger, primary_key=True)
    name: Mapped[str]                             = Column("name", String(250))
    user_id: Mapped[int]                          = Column("user_id", BigInteger, ) # ForeignKey("users.id")
    sort_index: Mapped[int]                       = Column("sort_index", BigInteger, default=0)
    public: Mapped[bool]                          = Column("public", Boolean, default=False)
    top3: Mapped[bool]                            = Column("top3", Boolean, default=False)

    # user: Mapped[ User ]        = relationship(back_populates="folders")
    # bonds: Mapped[ List[Bond] ] = relationship( foreign_keys=id, remote_side="BondsInFolders.folder_id", secondary=BondsInFolders )
    bonds: Mapped[ List[Bond] ] = relationship(
        "Bond",
        foreign_keys=id,
        remote_side="Bond.id",
        secondary=BondsInFolders.__table__,
        primaryjoin="foreign(BondsInFolders.folder_id) == Folder.id",
        secondaryjoin="foreign(BondsInFolders.bond_id) == Bond.id",
        lazy="selectin",
    )

    @property
    def bonds_ids(self):
        ids = []
        for bond in self.bonds:
            ids.append(bond.id)
        return ids

#

class Chat(Base):
    __tablename__ = "chats"

    id: Mapped[str]                              = Column("id", BigInteger, primary_key=True) # ForeignKey("users.id")
    unread_owner: Mapped[bool]                   = Column("unread_owner", Boolean, default=False)
    unread_admin: Mapped[bool]                   = Column("unread_admin", Boolean, default=False)
    updated: Mapped[datetime]                    = Column("updated", DateTime, default=datetime.now)

    user: Mapped[ User ] = relationship(
        "User",
        foreign_keys=id,
        remote_side="User.id",
        primaryjoin="foreign(Chat.id) == User.id",
        lazy="selectin"
    )

    @property
    def last_message(self) -> ChatMessage | None:
        last = None
        with SessionFront() as session:
            try:
                statement = \
                    select(ChatMessage)\
                    .where(
                        ChatMessage.chat_id == self.id
                    )\
                    .order_by(
                        ChatMessage.created.desc()
                    )\
                    .limit(1)
                
                query = session.execute(statement)
                last = query.scalars().one_or_none()
            except Exception:
                print('='*20)
                print('='*20)
                traceback.print_exc()
                print('='*20)
                print('='*20)
                pass
            finally:
                session.close()
        return last

class ChatMessage(Base):
    __tablename__ = "chats_messages"

    id: Mapped[int]                              = Column("id", BigInteger, primary_key=True)
    chat_id: Mapped[int]                         = Column("chat_id", BigInteger, ) # ForeignKey("chats.id")
    user_id: Mapped[int]                         = Column("user_id", BigInteger, ) # ForeignKey("users.id")
    created: Mapped[datetime]                    = Column("created", DateTime, default=datetime.now)
    message: Mapped[str]                         = Column("message", Text)

#

class Feature(Base):
    __tablename__ = "features"

    id: Mapped[int]                              = Column("id", BigInteger, primary_key=True)
    created_at: Mapped[datetime]                 = Column("created_at", DateTime, default=datetime.now)
    text: Mapped[str]                            = Column("text", Text)

#

class Gcurve(Base):
    __tablename__ = "gcurve"

    period: Mapped[str]                           = Column("period", String(6), primary_key=True)
    value: Mapped[str]                            = Column("value", Text)
    monthly: Mapped[str]                          = Column("monthly", Text)

class GcurveHistory(Base):
    __tablename__ = "gcurve_history"

    id: Mapped[int]                               = Column("id", BigInteger, primary_key=True)
    date: Mapped[datetime]                        = Column("date", Date, index=True, unique=True, default=datetime.today)
    data: Mapped[dict]                            = Column("data", JSON)

#

class Misc(Base):
    __tablename__ = "misc"

    id: Mapped[int]                               = Column("id", BigInteger, primary_key=True)
    key: Mapped[str]                              = Column("key", Text)
    value: Mapped[str]                            = Column("value", Text)

#

class LoadedRating(Base):
    __tablename__ = "loaded_ratings"
    __table_args__ = ( UniqueConstraint("bond_id", "borrower_id", "agency", name="bba_uniq_idx"), )

    id: Mapped[int]                               = Column("id", BigInteger, primary_key=True)
    bond_id: Mapped[int | None]                   = Column("bond_id", BigInteger, index=True, nullable=True) # ForeignKey("bonds.id")
    borrower_id: Mapped[int | None]               = Column("borrower_id", BigInteger, index=True, nullable=True) # ForeignKey("borrowers.id")
    agency: Mapped[str]                           = Column("agency", String(30), index=True)

class RaExpertLinkCache(Base):
    __tablename__ = "raexpert_links_cache"

    id: Mapped[int]                               = Column("id", BigInteger, primary_key=True)
    bond_id: Mapped[int | None]                   = Column("bond_id", BigInteger, index=True, nullable=True) # ForeignKey("bonds.id")
    borrower_id: Mapped[int | None]               = Column("borrower_id", BigInteger, index=True, nullable=True) # ForeignKey("borrowers.id")
    link: Mapped[str]                             = Column("link", Text)
